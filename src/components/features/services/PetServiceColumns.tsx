import { Button, Tag, Space } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { PetServiceDetail } from "../../../types/IServices";

export const petServiceColumns = (handleUpdate: (record: PetServiceDetail) => void, handleDelete: (id: string | null) => void) => [
    {
        title: "Service Type",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Price",
        dataIndex: "amount",
        key: "amount",
        render: (amount: number) => <span>${amount}</span>,
    },
    {
        title: "Pet Weight",
        key: "petWeight",
        render: (_: any, record: PetServiceDetail) => (
            <span>{record.petWeightMin} - {record.petWeightMax} kg</span>
        ),
    },
    {
        title: "Pet Type",
        key: "petType",
        render: (_: any, record: PetServiceDetail) => (
            <Tag color={record.petType ? "green" : "volcano"}>{record.petType ? "Dog" : "Cat"}</Tag>
        ),
    },
    {
        title: "Action",
        key: "action",
        render: (_: any, record: PetServiceDetail) => (
            <Space size="middle">
                <Button icon={<AiOutlineEdit />} onClick={() => handleUpdate(record)}>
                    Update
                </Button>
                <Button
                    danger
                    icon={<AiOutlineDelete />}
                    onClick={() => handleDelete(record.id)}
                >
                    Delete
                </Button>
            </Space>
        ),
    },
];
