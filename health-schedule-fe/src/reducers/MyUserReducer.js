// Để lưu truyền thông tin giữa các component -> rồi đi tạo context bên App.js

import cookie from 'react-cookies'


const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            cookie.remove('token');
            cookie.remove('user');
            return null;

    }
    return currentState;
}
export default MyUserReducer;