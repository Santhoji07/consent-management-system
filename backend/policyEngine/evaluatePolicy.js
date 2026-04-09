const { parseConsent } = require('./parseConsent');

/**
 * Extended policy evaluation engine that:
 * 1. Uses parsed policies from parseConsent.js
 * 2. Produces explainable decisions with detailed reasoning
 */

/**
 * Evaluate a consent request against a parsed policy
 * @param {Object} parsedPolicy - Policy object from parseConsent()
 * @param {Object} request - Access request with purpose, operation, dataType, etc.
 * @returns {Object} Decision with explanation
 */
function evaluateConsent(parsedPolicy, request) {
    const decision = {
        decision: 'DENY',
        reason: '',
        explanation: [],
        policyUsed: null,
        checkedConditions: {}
    };

    // Check 1: Consent status
    if (parsedPolicy.status && parsedPolicy.status !== 'ACTIVE') {
        decision.reason = 'Consent is not active';
        decision.explanation.push(`✗ Consent status is "${parsedPolicy.status}", must be ACTIVE`);
        return decision;
    }

    // Check 2: Purpose validation
    const purposeMatch = evaluatePurpose(parsedPolicy, request.purpose);
    decision.checkedConditions.purpose = purposeMatch;
    
    if (!purposeMatch.match) {
        decision.reason = 'Purpose not allowed';
        decision.explanation.push(`✗ Requested purpose "${request.purpose}" is not in allowed purposes: [${parsedPolicy.purposes.join(', ')}]`);
        return decision;
    }
    decision.explanation.push(`✓ Purpose "${request.purpose}" matches allowed purposes`);

    // Check 3: Expiry validation
    const expiryCheck = evaluateExpiry(parsedPolicy);
    decision.checkedConditions.expiry = expiryCheck;
    
    if (!expiryCheck.valid) {
        decision.reason = 'Consent has expired';
        decision.explanation.push(`✗ Consent expired on ${expiryCheck.expiryDate}`);
        return decision;
    }
    decision.explanation.push(`✓ Consent valid until ${expiryCheck.expiryDate}`);

    // Check 4: Data category validation
    if (request.dataType) {
        const dataCheck = evaluateDataType(parsedPolicy, request.dataType);
        decision.checkedConditions.dataType = dataCheck;
        
        if (!dataCheck.match) {
            decision.reason = 'Data type not covered by consent';
            decision.explanation.push(`✗ Data type "${request.dataType}" not in allowed categories: [${parsedPolicy.dataCategories.join(', ')}]`);
            return decision;
        }
        decision.explanation.push(`✓ Data type "${request.dataType}" is allowed`);
    }

    // Check 5: Operation validation
    if (request.operation) {
        const operationCheck = evaluateOperation(parsedPolicy, request.operation);
        decision.checkedConditions.operation = operationCheck;
        
        if (!operationCheck.match) {
            decision.reason = 'Operation not permitted';
            decision.explanation.push(`✗ Operation "${request.operation}" not in allowed operations: [${parsedPolicy.allowedOperations.join(', ')}]`);
            return decision;
        }
        decision.explanation.push(`✓ Operation "${request.operation}" is permitted`);
    }

    // Check 6: Recipient validation
    if (request.recipient) {
        const recipientCheck = evaluateRecipient(parsedPolicy, request.recipient);
        decision.checkedConditions.recipient = recipientCheck;
        
        if (!recipientCheck.match) {
            decision.reason = 'Recipient not authorized';
            decision.explanation.push(`✗ Recipient "${request.recipient}" not in authorized recipients: [${parsedPolicy.recipients.join(', ')}]`);
            return decision;
        }
        decision.explanation.push(`✓ Recipient "${request.recipient}" is authorized`);
    }

    // Check 7: Retention period
    if (request.requestedRetentionDays && parsedPolicy.retentionDays) {
        const retentionCheck = evaluateRetention(parsedPolicy, request.requestedRetentionDays);
        decision.checkedConditions.retention = retentionCheck;
        
        if (!retentionCheck.compliant) {
            decision.reason = 'Retention period exceeds consent limit';
            decision.explanation.push(`✗ Requested retention (${request.requestedRetentionDays} days) exceeds allowed (${parsedPolicy.retentionDays} days)`);
            return decision;
        }
        decision.explanation.push(`✓ Retention period (${request.requestedRetentionDays} days) is within allowed limit`);
    }

    // All checks passed
    decision.decision = 'GRANTED';
    decision.reason = 'All consent conditions met';
    decision.policyUsed = `v${parsedPolicy.version}`;
    
    return decision;
}

/**
 * Evaluate if the requested purpose matches allowed purposes
 */
function evaluatePurpose(policy, requestedPurpose) {
    if (!requestedPurpose) {
        return { match: false, reason: 'No purpose specified' };
    }
    
    const normalizedPurpose = requestedPurpose.toLowerCase();
    const allowedPurposes = policy.purposes.map(p => p.toLowerCase());
    
    // Check for exact match
    if (allowedPurposes.includes(normalizedPurpose)) {
        return { match: true, reason: 'Exact purpose match', matched: normalizedPurpose };
    }
    
    // Check for partial match
    const partialMatch = allowedPurposes.find(p => 
        normalizedPurpose.includes(p) || p.includes(normalizedPurpose)
    );
    
    if (partialMatch) {
        return { match: true, reason: 'Partial purpose match', matched: partialMatch };
    }
    
    return { match: false, reason: 'Purpose not in allowed list', allowed: allowedPurposes };
}

/**
 * Evaluate if consent has not expired
 */
function evaluateExpiry(policy) {
    if (!policy.expiry) {
        return { valid: true, reason: 'No expiry date set', expiryDate: 'Never' };
    }
    
    const expiryDate = new Date(policy.expiry);
    const now = new Date();
    const isValid = now < expiryDate;
    
    return {
        valid: isValid,
        expiryDate: expiryDate.toISOString().split('T')[0],
        daysRemaining: Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
    };
}

/**
 * Evaluate if requested data type is covered by consent
 */
function evaluateDataType(policy, requestedDataType) {
    if (!policy.dataCategories || policy.dataCategories.length === 0) {
        return { match: false, reason: 'No data categories defined' };
    }
    
    const normalizedDataType = requestedDataType.toLowerCase();
    const allowedCategories = policy.dataCategories.map(c => c.toLowerCase());
    
    const match = allowedCategories.find(cat => 
        normalizedDataType.includes(cat) || cat.includes(normalizedDataType)
    );
    
    return {
        match: !!match,
        reason: match ? 'Data type covered' : 'Data type not in consent',
        matched: match
    };
}

/**
 * Evaluate if requested operation is permitted
 */
function evaluateOperation(policy, requestedOperation) {
    if (!policy.allowedOperations || policy.allowedOperations.length === 0) {
        return { match: false, reason: 'No operations defined' };
    }
    
    const normalizedOp = requestedOperation.toLowerCase();
    const allowedOps = policy.allowedOperations.map(o => o.toLowerCase());
    
    const match = allowedOps.find(op => 
        normalizedOp.includes(op) || op.includes(normalizedOp)
    );
    
    return {
        match: !!match,
        reason: match ? 'Operation permitted' : 'Operation not allowed',
        matched: match
    };
}

/**
 * Evaluate if recipient is authorized
 */
function evaluateRecipient(policy, requestedRecipient) {
    if (!policy.recipients || policy.recipients.length === 0) {
        // If no recipients specified, check if explicit "not shared" or "not disclosed"
        if (policy.rawText && /not share|not disclose|do not share|do not disclose/i.test(policy.rawText)) {
            return { match: false, reason: 'Consent explicitly prohibits sharing' };
        }
        // Default allow if not specified (consent is for requester)
        return { match: true, reason: 'No recipient restriction' };
    }
    
    const normalizedRecipient = requestedRecipient.toLowerCase();
    const authorizedRecipients = policy.recipients.map(r => r.toLowerCase());
    
    const match = authorizedRecipients.find(r => 
        normalizedRecipient.includes(r) || r.includes(normalizedRecipient)
    );
    
    return {
        match: !!match,
        reason: match ? 'Recipient authorized' : 'Recipient not authorized',
        matched: match
    };
}

/**
 * Evaluate if requested retention period is within allowed limit
 */
function evaluateRetention(policy, requestedDays) {
    const allowedDays = policy.retentionDays;
    
    if (!allowedDays) {
        return { compliant: true, reason: 'No retention limit specified' };
    }
    
    return {
        compliant: requestedDays <= allowedDays,
        requested: requestedDays,
        allowed: allowedDays,
        reason: requestedDays <= allowedDays ? 'Within limit' : 'Exceeds limit'
    };
}

/**
 * Parse and evaluate consent from raw text
 * Convenience function that combines parseConsent + evaluateConsent
 */
function evaluateFromRawText(rawConsentText, request) {
    const parsedPolicy = parseConsent(rawConsentText);
    return evaluateConsent(parsedPolicy, request);
}

/**
 * Create a policy object from structured consent data
 * Use when consent is stored in structured format (not raw text)
 * Note: consentData from chaincode has expiry in conditions.expiry
 */
function createPolicyFromStructured(consentData) {
    return {
        version: consentData.version || 1,
        purposes: consentData.purpose ? [consentData.purpose] : [],
        recipients: consentData.orgId ? [consentData.orgId] : [],
        retentionDays: consentData.retentionDays || null,
        // Get expiry from conditions object (chaincode format) or top level
        expiry: (consentData.conditions && consentData.conditions.expiry) || consentData.expiry || null,
        dataCategories: consentData.dataType ? [consentData.dataType] : [],
        // Include 'access' operation for consent requests plus standard operations
        allowedOperations: ['collect', 'use', 'process', 'access', 'read'],
        status: consentData.status || 'ACTIVE',
        rawText: ''
    };
}

module.exports = { 
    evaluateConsent, 
    evaluateFromRawText,
    createPolicyFromStructured,
    evaluatePurpose,
    evaluateExpiry,
    evaluateDataType,
    evaluateOperation,
    evaluateRecipient,
    evaluateRetention
};

