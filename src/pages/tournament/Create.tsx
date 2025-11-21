import { tournamentService } from "../../services/tournamentService";
import React, { useState } from "react";
import { TournamentFormatValues, type TournamentFormat } from "@/common/types/tournament";
import { Form, Input, Select, InputNumber, DatePicker, Button, message, Card, notification } from "antd";
import dayjs from "dayjs";


export const CreateTournamentPage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const tournamentFormatOptions = TournamentFormatValues.map(v => ({
        value: v as TournamentFormat,
        label: v.replaceAll("_", " ")
    }));

    const changeTime = (value: any) => {
        if (!value) return "";
        return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);

            const payload = {
                ...values,
                registrationStart: changeTime(values.registrationStart),
                registrationEnd: changeTime(values.registrationEnd),
                startDate: changeTime(values.registrationStart),
            };

            const res = await tournamentService.create(payload);
            console.log("Tournament created:", res.data);

            notification.success({
                message: "Tạo giải đấu thành công",
                description: `Giải đấu "${res.data.name}" đã được tạo thành công.`,
            });
        } catch (err) {
            notification.error({
                message: "Tạo giải đấu thất bại",
                description: "Đã có lỗi xảy ra khi tạo giải đấu. Vui lòng thử lại.",
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Tạo Giải Đấu" style={{ maxWidth: 800, margin: "30px auto" }}>

            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                initialValues={{
                    maxTeams: 1,
                    registrationStart: dayjs(),
                    registrationEnd: dayjs(),
                }}
            >

                {/* NAME */}
                <Form.Item
                    label="Tên giải đấu"
                    name="name"
                    rules={[{ required: true, message: "Tên giải đấu là bắt buộc" }]}
                >
                    <Input placeholder="Nhập tên giải đấu" />
                </Form.Item>

                {/* PHONE */}
                {/* <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: "Số điện thoại là bắt buộc" }]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item> */}

                {/* ADDRESS */}
                {/* <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Địa chỉ là bắt buộc" }]}
                >
                    <Input placeholder="Nhập địa chỉ tổ chức" />
                </Form.Item> */}

                {/* GAME */}
                <Form.Item
                    label="Game"
                    name="game"
                    rules={[{ required: true, message: "Vui lòng nhập game" }]}
                >
                    <Input placeholder="Ví dụ: Liên Minh, Valorant, CS2 ..." />
                </Form.Item>

                {/* FORMAT */}
                <Form.Item
                    label="Thể thức thi đấu"
                    name="format"
                    rules={[{ required: true, message: "Chọn thể thức thi đấu" }]}
                >
                    <Select
                        placeholder="-- Chọn thể thức --"
                        options={tournamentFormatOptions}
                    />
                </Form.Item>

                {/* MAX TEAMS */}
                <Form.Item
                    label="Số đội tối đa"
                    name="maxTeams"
                    rules={[{ required: true, message: "Phải lớn hơn 1" }]}
                >
                    <InputNumber min={2} style={{ width: "100%" }} />
                </Form.Item>

                {/* REGISTRATION START */}
                <Form.Item
                    label="Ngày bắt đầu đăng ký"
                    name="registrationStart"
                    rules={[{ required: true, message: "Chọn thời gian" }]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                {/* REGISTRATION END */}
                <Form.Item
                    label="Ngày kết thúc đăng ký"
                    name="registrationEnd"
                    rules={[{ required: true, message: "Chọn thời gian" }]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                {/* SUBMIT */}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        Tạo giải đấu
                    </Button>
                </Form.Item>

            </Form>
        </Card>
    );
};
