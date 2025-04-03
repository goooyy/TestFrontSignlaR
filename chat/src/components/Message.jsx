export const Message = ({ messageInfo }) => {
    return (
        <div style={{marginBottom:10}}>
            <span style={{fontWeight:"bold"}}>{messageInfo.userId}</span>
            <div>
                {messageInfo.message}
            </div>
        </div>
    )
};