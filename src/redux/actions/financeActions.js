export const tally_data = (data)=>async(dispatch)=>{
dispatch({
    type:'TALLY_DATA',
    payload:data
})
}