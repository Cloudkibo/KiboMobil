// constants for basicinfo
export const LOAD_USER_DETAILS = 'LOAD_USER_DETAILS'
export const GET_AUTOMATED_OPTIONS = 'GET_AUTOMATED_OPTIONS'

// constants for dashboard
export const UPDATE_DASHBOARD = 'UPDATE_DASHBOARD'
export const UPDATE_DASHBOARD_INFO = 'UPDATE_DASHBOARD_INFO'

// constants for pages
export const FETCH_PAGES_LIST = 'FETCH_PAGES_LIST'
export const FETCH_CONNECTED_PAGES_LIST = 'FETCH_CONNECTED_PAGES_LIST'
export const CONNECT_FB_PAGE_EVENT = 'CONNECT_FB_PAGE_EVENT'
export const DISCONNECT_FB_PAGE_EVENT = 'DISCONNECT_FB_PAGE_EVENT'

// constants for subscribers
export const FETCH_SUBSCRIBERS = 'FETCH_SUBSCRIBERS'
export const FETCH_SUBSCRIBERS_OVERRIDE = 'FETCH_SUBSCRIBERS_OVERRIDE'
export const FETCH_SUBSCRIBERS_SEARCH = 'FETCH_SUBSCRIBERS_SEARCH'
export const FETCH_SUBSCRIBERS_SEARCH_OVERRIDE = 'FETCH_SUBSCRIBERS_SEARCH_OVERRIDE'
export const UPDATE_SUBSCRIBER_PICTURE = 'UPDATE_SUBSCRIBER_PICTURE'
export const UPDATE_SUBSCRIBERS_INFO = 'UPDATE_SUBSCRIBERS_INFO'
export const NEW_SUBSCRIBER_EVENT = 'NEW_SUBSCRIBER_EVENT'
export const SUBSCRIBE_EVENT = 'SUBSCRIBE_EVENT'
export const UNSUBSCRIBE_EVENT = 'UNSUBSCRIBE_EVENT'

// constants live chat
export const BACKGROUND_SESSION_DATA_FETCH = 'BACKGROUND_SESSION_DATA_FETCH'
export const FETCH_SESSION_DATA = 'FETCH_SESSION_DATA'
export const UPDATE_CHAT_SESSIONS = 'UPDATE_CHAT_SESSIONS'
export const RESET_UNREAD_SESSION = 'RESET_UNREAD_SESSION'
export const SHOW_CHAT_SESSIONS = 'SHOW_CHAT_SESSIONS'
export const SHOW_OPEN_CHAT_SESSIONS = 'SHOW_OPEN_CHAT_SESSIONS'
export const SHOW_OPEN_CHAT_SESSIONS_OVERWRITE = 'SHOW_OPEN_CHAT_SESSIONS_OVERWRITE'
export const SHOW_CLOSE_CHAT_SESSIONS = 'SHOW_CLOSE_CHAT_SESSIONS'
export const SHOW_CLOSE_CHAT_SESSIONS_OVERWRITE = 'SHOW_CLOSE_CHAT_SESSIONS_OVERWRITE'
export const SHOW_USER_CHAT = 'SHOW_USER_CHAT'
export const SHOW_USER_CHAT_OVERWRITE = 'SHOW_USER_CHAT_OVERWRITE'
export const SOCKET_UPDATE = 'SOCKET_UPDATE'
export const SOCKET_UPDATE_SEEN = 'SOCKET_UPDATE_SEEN'
export const RESET_SOCKET = 'RESET_SOCKET'
export const LOADING_URL_META = 'LOADING_URL_META'
export const GET_URL_META = 'GET_URL_META'
export const UPDATE_CHAT = 'UPDATE_CHAT'
export const CHANGE_STATUS = 'CHANGE_STATUS'
export const SET_ACTIVE_SESSION = 'SET_ACTIVE_SESSION'
export const RESET_ACTIVE_SESSION = 'RESET_ACTIVE_SESSION'
export const SHOW_SEARCH_CHAT = 'SHOW_SEARCH_CHAT'
export const UPDATE_USER_CHAT = 'UPDATE_USER_CHAT'
export const CLEAR_SEARCH_RESULT = 'CLEAR_SEARCH_RESULT'
export const SHOW_CUSTOMERS = 'SHOW_CUSTOMERS'
export const UPDATE_OPEN_SESSIONS_WITH_CUSTOMERID = 'UPDATE_OPEN_SESSIONS_WITH_CUSTOMERID'
export const UPDATE_CLOSE_SESSIONS_WITH_CUSTOMERID = 'UPDATE_CLOSE_SESSIONS_WITH_CUSTOMERID'
export const UPDATE_SESSIONS = 'UPDATE_SESSIONS'
export const EMPTY_SOCKET_DATA = 'EMPTY_SOCKET_DATA'
export const CLEAR_USER_CHAT = 'CLEAR_USER_CHAT'
export const UPDATE_LIVECHAT_INFO = 'UPDATE_LIVECHAT_INFO'
export const UPDATE_SESSION_PROFILE_PICTURE = 'UPDATE_SESSION_PROFILE_PICTURE'
export const UPDATE_TEAM_AGENTS = 'UPDATE_TEAM_AGENTS'
export const SET_USER_CHAT = 'SET_USER_CHAT'
export const ALL_CHAT_OVERWRITE = 'ALL_CHAT_OVERWRITE'
export const ALL_CHAT_UPDATE = 'ALL_CHAT_UPDATE'

export const LOADING_CHAT = 'LOADING_CHAT'
// constants for members
export const LOAD_MEMBERS = 'LOAD_MEMBERS'

// constants for teams
export const SHOW_TEAMS_LIST = 'SHOW_TEAMS_LIST'

//  constants for socket
export const SET_SOCKET_STATUS = 'SET_SOCKET_STATUS'
export const SOCKET_EVENT = 'SOCKET_EVENT'
export const CLEAR_SOCKET_DATA = 'CLEAR_SOCKET_DATA'
export const SOCKET_EVENT_WHATSAPP = 'SOCKET_EVENT_WHATSAPP'
export const CLEAR_SOCKET_DATA_WHATSAPP = 'CLEAR_SOCKET_DATA_WHATSAPP'
export const SOCKET_EVENT_SUBSCRIBERS = 'SOCKET_EVENT_SUBSCRIBERS'
export const CLEAR_SOCKET_DATA_SUBSCRIBERS = 'CLEAR_SOCKET_DATA_SUBSCRIBERS'
export const SOCKET_EVENT_SUBSCRIBERS_WHATSAPP = 'SOCKET_EVENT_SUBSCRIBERS_WHATSAPP'
export const CLEAR_SOCKET_DATA_SUBSCRIBERS_WHATSAPP = 'CLEAR_SOCKET_DATA_SUBSCRIBERS_WHATSAPP'
export const BACKGROUND_DATA_FETCH = 'BACKGROUND_DATA_FETCH'
export const BACKGROUND_DATA_FETCH_WHATSAPP = 'BACKGROUND_DATA_FETCH_WHATSAPP'

// constants for Settings
export const GET_CANNED_RESPONSES = 'GET_CANNED_RESPONSES'
export const UPDATE_ZOOM_INTEGRATIONS = 'UPDATE_ZOOM_INTEGRATIONS'
export const UPDATE_WHATSAPP_MESSAGE_TEMPLATES = 'UPDATE_WHATSAPP_MESSAGE_TEMPLATES'
// constants for smsWhatsAppDashboard
export const SHOW_CARDBOXES_DATA = 'SHOW_CARDBOXES_DATA'
export const UPDATE_DASHBOARD_INFO_WHATSAPP = 'UPDATE_DASHBOARD_INFO_WHATSAPP'

// constants for whatsAppChat
export const BACKGROUND_WHATSAPP_SESSION_FETCH = 'BACKGROUND_WHATSAPP_SESSION_FETCH'
export const FETCH_WHATSAPP_OPEN_SESSIONS = 'FETCH_WHATSAPP_OPEN_SESSIONS'
export const FETCH_WHATSAPP_CLOSE_SESSIONS = 'FETCH_WHATSAPP_CLOSE_SESSIONS'
export const FETCH_WHATSAPP_CHAT = 'FETCH_WHATSAPP_CHAT'
export const FETCH_WHATSAPP_CHAT_OVERWRITE = 'FETCH_WHATSAPP_CHAT_OVERWRITE'
export const UPDATE_WHATSAPP_SESSION = 'UPDATE_WHATSAPP_SESSION'
export const UPDATE_WHATSAPP_CHAT = 'UPDATE_WHATSAPP_CHAT'
export const SOCKET_UPDATE_WHATSAPP = 'SOCKET_UPDATE_WHATSAPP'
export const UPDATE_SESSIONS_WHATSAPP = 'UPDATE_SESSIONS_WHATSAPP'
export const CLEAR_SEARCH_WHATSAPP = 'CLEAR_SEARCH_WHATSAPP'
export const SHOW_SEARCH_WHATSAPP = 'SHOW_SEARCH_WHATSAPP'
export const RESET_SOCKET_WHATSAPP = 'RESET_SOCKET_WHATSAPP'
export const SOCKET_UPDATE_WHATSAPP_SEEN = 'SOCKET_UPDATE_WHATSAPP_SEEN'
export const UPDATE_WHATSAPPCHAT_INFO = 'UPDATE_WHATSAPPCHAT_INFO'
export const UPDATE_UNREAD_COUNT_WHATSAPP = 'UPDATE_UNREAD_COUNT_WHATSAPP'
export const UPDATE_WHATSAPP_OPEN_SESSION = 'UPDATE_WHATSAPP_OPEN_SESSION'
export const SHOW_OPEN_WHATSAPP_SESSIONS_OVERWRITE = 'SHOW_OPEN_WHATSAPP_SESSIONS_OVERWRITE'
export const SHOW_CLOSE_WHATSAPP_SESSIONS_OVERWRITE = 'SHOW_CLOSE_WHATSAPP_SESSIONS_OVERWRITE'
// constants for whatsAppSubscribers
export const LOAD_WHATSAPP_CONTACTS_OVERRIDE = 'LOAD_WHATSAPP_CONTACTS_OVERRIDE'
export const LOAD_WHATSAPP_CONTACTS = 'LOAD_WHATSAPP_CONTACTS'
export const UPDATE_WHATSAPP_CONTACT = 'UPDATE_WHATSAPP_CONTACT'
export const UPDATE_SUBSCRIBERS_INFO_WHATSAPP = 'UPDATE_SUBSCRIBERS_INFO_WHATSAPP'
export const NEW_SUBSCRIBER_WHATSAPP_EVENT = 'NEW_SUBSCRIBER_WHATSAPP_EVENT'
export const SUBSCRIBE_WHATSAPP_EVENT = 'SUBSCRIBE_WHATSAPP_EVENT'
export const UNSUBSCRIBE_WHATSAPP_EVENT = 'UNSUBSCRIBE_WHATSAPP_EVENT'
export const UPDATE_SUBSCRIBER_WHATSAPP_EVENT = 'UPDATE_SUBSCRIBER_WHATSAPP_EVENT'

// constants for expoToken
export const SAVE_EXPOTOKEN = 'SAVE_EXPOTOKEN'
