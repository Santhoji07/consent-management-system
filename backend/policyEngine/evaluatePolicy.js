function evaluateConsent(consent, request) {

    if (consent.status !== "ACTIVE") {
        return { decision: "DENY", reason: "Consent not active" };
    }

    if (request.purpose !== consent.purpose) {
        return { decision: "DENY", reason: "Purpose mismatch" };
    }

    if (new Date() > new Date(consent.conditions.expiry)) {
        return { decision: "DENY", reason: "Consent expired" };
    }

    return { decision: "ALLOW", reason: "Valid active consent" };
}

module.exports = { evaluateConsent };