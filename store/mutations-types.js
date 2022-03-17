// app
export const SET_USER_INFO = 'SET_USER_INFO' // 设置用户信息
export const GET_USER_INFO = 'GET_USER_INFO' // 获取用户信息
export const LOGIN_OUT = 'LOGIN_OUT'  // 注销登陆

// play control
export const SET_CURRENT_MUSIC = 'SET_CURRENT_MUSIC' // 设置当前播放音乐
export const SET_CURRENT_MUSIC_LIST = 'SET_CURRENT_MUSIC_LIST' // 设置当前音乐播放列表
export const SET_CURRENT_TIME = 'SET_CURRENT_TIME' // 设置当前音乐播放进度时间
export const SET_DURATION = 'SET_DURATION' // 设置当前播放音乐总时长
export const SET_PAUSED = 'SET_PAUSED' // 设置暂停状态
export const PLAY_PAUSE = 'PLAY_PAUSE' // 切换播放、暂停状态
export const PLAY_NEXT = 'PLAY_NEXT' // 播放上一首
export const PLAY_PREV = 'PLAY_PREV' // 播放下一首
export const TIME_UPDATE = 'TIME_UPDATE' // 音乐时长信息更新
export const RESET_STATE = 'RESET_STATE' // 重置播放器状态
export const SET_TONE_QUALITY = 'SET_TONE_QUALITY' // 设置播放音质
export const ON_ENDED = 'ON_ENDED' // 播放结束标志
export const SET_LIKE_LIST_IDS = 'SET_LIKE_LIST_IDS' // 设置喜欢列表ID集合
export const ADD_LIKE_LIST_ID = 'ADD_LIKE_LIST_ID' // 添加喜欢
export const DEL_LIKE_LIST_ID = 'DEL_LIKE_LIST_ID' // 移除喜欢
// play mode
export const SET_PLAY_MODE = 'SET_PLAY_MODE' // 设置播放模式
export const PLAY_MODE_SEQUE = 'PLAY_MODE_SEQUE' // 顺序播放
export const PLAY_MODE_REPEAT_ONE = 'PLAY_MODE_REPEAT_ONE' // 单曲循环
export const PLAY_MODE_SHUFFLE = 'PLAY_MODE_SHUFFLE' // 随机播放
