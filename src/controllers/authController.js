export const signIn = async (req, res) => {
    res.json({
        request: 'signIn'
    })
};
export const signInNewToken = async (req, res) => {
    res.json({
        request: 'signInNewToken'
    })
};
export const signUp = async (req, res) => {
    res.json({
        request: 'signUp'
    })
};
export const info = async (req, res) => {
    res.json({
        request: 'info'
    })
};
export const logout = async (req, res) => {
    res.json({
        request: 'logout'
    })
};