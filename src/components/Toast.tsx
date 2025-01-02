import { Button, notification } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';

export default function Toast() {
    const [api, contextHolder] = notification.useNotification()

    const openNotification = (placement: NotificationPlacement) => {
        api.info({
            message: `Notification`,
            description: "Notyfication description",
            placement,
            closable: true,
            duration: null,
        });
    };

    return (
        <>
            {contextHolder}
            <Button type="primary" onClick={() => {
                openNotification('topLeft')
            }}
            >Open</Button>
        </>
    )
}
