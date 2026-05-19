# utils.py
# Helper functions used by the API endpoints

def get_risk_level(churn_probability: float) -> str:
    """
    Convert a probability number to a risk label.
    
    Example:
        0.25 → "Low"
        0.55 → "Medium"
        0.82 → "High"
    """
    if churn_probability < 0.3:
        return "Low"
    elif churn_probability < 0.55:
        return "Medium"
    else:
        return "High"


def generate_recommendation(churn_probability: float, segment_name: str) -> str:
    """
    Suggest a business action based on churn risk and customer segment.
    """
    if churn_probability < 0.3:
        return "Customer is healthy. Great opportunity to upsell or cross-sell new products."

    elif churn_probability < 0.55:
        # Medium risk
        if segment_name == "VIP":
            return "Medium risk VIP — Send a personalised loyalty reward or early access to new arrivals."
        elif segment_name == "Loyal":
            return "Loyal customer showing signs of disengagement — Offer bonus points or a thank-you discount."
        elif segment_name == "New":
            return "New customer at risk — Send a welcome follow-up with 10% off their next order."
        else:
            return "Send a re-engagement email with product recommendations based on past purchases."

    else:
        # High risk
        if segment_name == "VIP":
            return "URGENT: High-value VIP at serious risk — Assign for personal outreach immediately."
        else:
            return "High churn risk — Send a 20% discount voucher expiring in 7 days to create urgency."


def calculate_roi(churn_probability: float, monetary: float) -> dict:
    """
    Calculate the business value of retaining this customer.
    
    Logic:
    - value_at_risk: how much revenue we might lose if they churn
    - intervention_cost: cost of sending a retention offer (e.g. a discount)
    - expected_save: how much revenue we expect to save with the offer
    - roi: return on investment of the retention effort
    """
    intervention_cost   = 10.0    # £10 discount or voucher
    retention_lift      = 0.15    # Offer improves retention by 15%

    value_at_risk  = round(churn_probability * monetary, 2)
    expected_save  = round(value_at_risk * retention_lift, 2)
    net_benefit    = round(expected_save - intervention_cost, 2)
    roi = 0
    if intervention_cost > 0:
        roi = round(net_benefit / intervention_cost, 2)


    return {
        "value_at_risk":      value_at_risk,
        "intervention_cost":  intervention_cost,
        "expected_save":      expected_save,
        "net_benefit":        net_benefit,
        "roi":                roi,
        "worth_intervening":  net_benefit > 0
    }
def safe_aov_check(frequency: int, monetary: float) -> tuple:
    """
    Safely calculate AOV and return error status.
    Returns: (is_valid, aov_value, error_message)
    """
    if frequency <= 0:
        return (False, 0, "Frequency must be > 0 (division-by-zero in AOV calculation)")
    
    aov = round(monetary / frequency, 2)
    return (True, aov, None)

