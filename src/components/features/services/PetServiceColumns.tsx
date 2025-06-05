import { Button, Tag, Space } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { PetServiceDetail } from "../../../types/IServices";

export const petServiceColumns = (handleUpdate: (record: PetServiceDetail) => void, handleDelete: (id: string | null) => void) => [
    {
        title: "Loại dịch vụ",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Giá",
        dataIndex: "amount",
        key: "amount",
        render: (amount: number) => <span>{amount.toLocaleString('vi-VN')}đ</span>,
    },
    {
        title: "Cân nặng thú cưng",
        key: "petWeight",
        render: (_: any, record: PetServiceDetail) => (
            <span>{record.petWeightMin} - {record.petWeightMax} kg</span>
        ),
    },
    {
        title: "Loại thú cưng",
        key: "petType",
        render: (_: any, record: PetServiceDetail) => (
            <Tag color={record.petType ? "green" : "volcano"}>{record.petType ? "Chó" : "Mèo"}</Tag>
        ),
    },
    {
        title: "Thao tác",
        key: "action",
        render: (_: any, record: PetServiceDetail) => (
            <Space size="middle">
                <Button icon={<AiOutlineEdit />} onClick={() => handleUpdate(record)}>
                    Cập nhật
                </Button>
                <Button
                    danger
                    icon={<AiOutlineDelete />}
                    onClick={() => handleDelete(record.id)}
                >
                    Xóa
                </Button>
            </Space>
        ),
    },
];
