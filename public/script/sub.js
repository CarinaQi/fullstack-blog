window.addEventListener("load", function () {

    const btn_unsubscription = document.querySelectorAll(".btn_unsubscription");
    const subscription_number = document.querySelector("#subscription_number");
    let subscription_count = subscription_number.innerText.match(/\d+/g);
    btn_unsubscription.forEach(async (btn) => {
        const idValue = btn.querySelector(".subscription_id");
        const subscription_id = idValue.value
        btn.addEventListener("click", function (event) {
            removeSubscription(subscription_id, event);
        });
    })
    
    const subscriber_number = document.querySelector("#subscriber_number");
    let subscriber_count = subscriber_number.innerText.match(/\d+/g);
    const btn_unsubscriber = document.querySelectorAll(".btn_unsubscriber");
    btn_unsubscriber.forEach(async (btn) => {
        const idValue = btn.querySelector(".subscriber_id");
        const subscriber_id = idValue.value
        btn.addEventListener("click", function (event) {
            removeSubscriber(subscriber_id, event);
        });
    })

    async function removeSubscription(subscription_id, event) {
        const subscriptionId = subscription_id;
        fetch(`/removeSubscription?id=${subscriptionId}`)
            .then(response => {
                if (response.status === 200) {
                    event.target.closest(".subscription_rows").remove();
                    subscription_count--;
                    if(subscription_count != 0){
                        subscription_number.innerText = `${subscription_count} Subscriptions`
                    } else if(subscription_count == 0){
                        subscription_number.innerText = `${subscription_count} Subscription`
                    }
                } else {
                    console.error('Error removing subscription');
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
    }

    async function removeSubscriber(subscriber_id, event) {
        const subscriberId = subscriber_id;
        fetch(`/removeSubscriber?id=${subscriberId}`)
            .then(response => {
                if (response.status === 200) {
                    event.target.closest(".subscriber_rows").remove();
                    subscriber_count--;
                    if(subscriber_count != 0){
                        subscriber_number.innerText = `${subscriber_count} Subscribers`
                    } else if(subscriber_count == 0){
                        subscriber_number.innerText = `${subscriber_count} Subscriber`
                    }
                } else {
                    console.error('Error removing subscriber');
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
    }

})
