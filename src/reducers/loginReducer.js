
const initialState = {
    name: undefined
}

export default function loginReducer(state = initialState, action) {

    switch (action.type) {
        case 'login':
            return {
                name: action.payload
            }
        // eslint-disable-next-line no-fallthrough
        default:
            return state;
    }
}