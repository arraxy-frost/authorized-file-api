export const uploadFile = async (req, res) => {
    res.json({
        request: 'uploadFile'
    })
}
export const listFiles = async (req, res) => {
    res.json({
        request: 'listFiles'
    })
}
export const deleteFileById = async (req, res) => {
    res.json({
        request: 'deleteFileById'
    })
}
export const getFileById = async (req, res) => {
    res.json({
        request: 'getFileById'
    })
}
export const downloadFileById = async (req, res) => {
    res.json({
        request: 'downloadFileById'
    })
}
export const updateFileById = async (req, res) => {
    res.json({
        request: 'updateFileById'
    })
}