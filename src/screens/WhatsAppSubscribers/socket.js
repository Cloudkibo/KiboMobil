export function handleSocketEvent (data, state, props, updateSubscribersInfo, updateDashboardInfo, clearSocketData) {
  switch (data.action) {
    case 'new_subscriber_whatsapp':
      handleNewSubscriber(data.payload, state, props, updateSubscribersInfo, clearSocketData, updateDashboardInfo)
      break
    default:
  }
}

const handleNewSubscriber = (payload, state, props, updateSubscribersInfo, clearSocketData, updateDashboardInfo) => {
  let subscribers = props.subscribers
  subscribers = [payload.subscriber, ...subscribers]
  let data = {
    subscribers: subscribers,
    count: props.count + 1
  }
  updateSubscribersInfo(data)

  let dashboardData = props.cardBoxesData
  dashboardData.subscribers = dashboardData.subscribers + 1
  updateDashboardInfo({cardBoxesData: dashboardData})

  clearSocketData()
}
