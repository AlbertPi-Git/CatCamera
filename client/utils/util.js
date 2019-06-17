const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime_hour=(date)=>{
  const hour=date.getHours();
  return hour;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success',
})

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 2000
})

//显示错误
var showFailed = text => wx.showToast({
  title: text,
  icon: 'none',
})

// var showModal = (title, content) => {
//   wx.hideToast();

//   wx.showModal({
//     title,
//     content: JSON.stringify(content),
//     showCancel: false
//   })
// }

module.exports = {
  formatTime: formatTime,
  formatTime_hour:formatTime_hour,
  showSuccess:showSuccess,
  showBusy:showBusy,
  showFailed:showFailed

}
