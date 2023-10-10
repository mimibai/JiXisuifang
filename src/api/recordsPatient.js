//获取住院记录
export function GetInpatientRecordList(data) {
    return request({
        url: '/FrontPatientInterfaces/InpatientRecords/GetInpatientRecordList',
        method: 'get',
        params: data
    })
}
//维护入院登记信息(Get)
export function CreateInpatientRegistrationRecord(data) {
    return request({
        url: '/FrontPatientInterfaces/InpatientRecords/CreateInpatientRegistrationRecord',
        method: 'get',
        params: data
    })
}
//维护入院登记信息(Post)
export function CreateInpatientRegistrationRecordPost(data) {
    return request({
        url: '/FrontPatientInterfaces/InpatientRecords/CreateInpatientRegistrationRecord',
        method: 'post',
        params: data
    })
}
