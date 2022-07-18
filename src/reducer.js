import loginReducer from './reducers/loginReducer'


export default function rootReducer(state = {}, action) {

    return {
        user: loginReducer(state.user, action)
    }

}