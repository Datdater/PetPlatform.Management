import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Input, Modal, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface PetServiceStep {
    id: string;
    name: string;
    description: string;
    priority: number;
}

const ServiceStep: React.FC<{ serviceData?: any, onUpdateSteps?: (steps: PetServiceStep[]) => void }> = ({
                                                                                                             serviceData,
                                                                                                             onUpdateSteps
                                                                                                         }) => {
    const [steps, setSteps] = useState<PetServiceStep[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingStep, setEditingStep] = useState<PetServiceStep | null>(null);
    const [form] = Form.useForm();
    const [idCounter, setIdCounter] = useState(1);
    const initialLoadDone = useRef(false);

    // Initialize steps from serviceData or localStorage
    useEffect(() => {
        if (serviceData?.petServiceSteps?.length > 0 && !initialLoadDone.current) {
            setSteps(serviceData.petServiceSteps);
            const maxId = Math.max(...serviceData.petServiceSteps.map((step: PetServiceStep) => step.id || 0), 0);
            setIdCounter(maxId + 1);
            initialLoadDone.current = true;
        } else if (!initialLoadDone.current) {
            // If no steps in serviceData, check localStorage as fallback
            const savedSteps = localStorage.getItem('serviceSteps');
            if (savedSteps) {
                try {
                    const parsedSteps = JSON.parse(savedSteps);
                    if (Array.isArray(parsedSteps) && parsedSteps.length > 0) {
                        setSteps(parsedSteps);
                        const maxId = Math.max(...parsedSteps.map((step: PetServiceStep) =>
                            step.id ? parseInt(step.id, 10) : 0), 0);
                        setIdCounter(maxId + 1);
                        initialLoadDone.current = true;
                    }
                } catch (error) {
                    console.error('Error parsing saved steps:', error);
                }
            }
            initialLoadDone.current = true; // Mark as initialized even if empty
        }
    }, [serviceData]);

    // Sync changes back to parent and localStorage
    useEffect(() => {
        if (initialLoadDone.current && onUpdateSteps) {
            localStorage.setItem('serviceSteps', JSON.stringify(steps));
            onUpdateSteps(steps);
        }
    }, [steps, onUpdateSteps]);

    const showModal = () => {
        form.resetFields();
        setEditingStep(null);
        setIsModalVisible(true);
    };

    const handleUpdateStep = (step: PetServiceStep) => {
        setEditingStep(step);
        form.setFieldsValue(step);
        setIsModalVisible(true);
    };

    const handleDeleteStep = (step: PetServiceStep) => {
        const updatedSteps = steps.filter(s => s.id !== step.id);
        setSteps(updatedSteps);

        localStorage.setItem('serviceSteps', JSON.stringify(updatedSteps));
        if (onUpdateSteps) {
            onUpdateSteps(updatedSteps);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const newStep: PetServiceStep = {
                    ...values,
                    id: editingStep ? editingStep.id : idCounter.toString(),
                    priority: editingStep ? editingStep.priority : steps.length + 1
                };

                const updatedSteps = editingStep
                    ? steps.map(step => step.id === editingStep.id ? newStep : step)
                    : [...steps, newStep];

                setSteps(updatedSteps);

                if (!editingStep) {
                    setIdCounter(prev => prev + 1);
                }

                // Directly update localStorage and notify parent
                localStorage.setItem('serviceSteps', JSON.stringify(updatedSteps));
                if (onUpdateSteps) {
                    onUpdateSteps(updatedSteps);
                }

                setIsModalVisible(false);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <div style={{ margin: "0 auto", width: "70%", padding: "20px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography.Title level={4}>Service Steps</Typography.Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                >
                    Add Step
                </Button>
            </div>

            {/* Steps List */}
            <div style={{ paddingLeft: "30px", borderLeft: "2px solid #1890ff", marginBottom: "20px" }}>
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        style={{
                            marginBottom: "20px",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div
                                    style={{
                                        backgroundColor: "#1890ff",
                                        color: "#fff",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "10px",
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <Typography.Text strong style={{ fontSize: "16px" }}>
                                    {step.name}
                                </Typography.Text>
                            </div>
                            <div>
                                <Button type="link" onClick={() => handleUpdateStep(step)}>Update</Button>
                                <Button type="link" onClick={() => handleDeleteStep(step)}>Delete</Button>
                            </div>
                        </div>
                        <Typography.Paragraph style={{ marginTop: "5px", color: "#595959" }}>
                            {step.description}
                        </Typography.Paragraph>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                title={editingStep ? "Edit Service Step" : "Add Service Step"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: "",
                        description: ""
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Step Name"
                        rules={[{ required: true, message: 'Please enter a step name' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Step Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ServiceStep;