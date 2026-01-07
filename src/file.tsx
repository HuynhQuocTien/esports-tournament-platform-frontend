import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  message,
  Row,
  Col,
  Typography,
  Divider,
  InputNumber,
  DatePicker,
  Switch,
  type UploadFile,
  type UploadProps,
  Upload,
  Image,
} from "antd";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { tournamentService } from "@/services/tournamentService";
import type { TournamentBasicInfo } from "@/common/types";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { gameService } from "@/services/gameService";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateTournamentPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tournamentType, setTournamentType] = useState("team");
  const [allowIndividual, setAllowIndividual] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [bannerFile, setBannerFile] = useState<UploadFile | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [gameOptions, setGameOptions] = useState<string[]>([]);

  React.useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await gameService.getGames();
        setGameOptions(games.map((game) => game.name));
      } catch (error) {
        console.error("Error loading games:", error);
      }
    };
    loadGames();
  }, []);

  const tournamentFormat = [
    { value: "SINGLE_ELIMINATION", label: "Loại trực tiếp" },
    { value: "DOUBLE_ELIMINATION", label: "Loại đấu đôi" },
  ];

  const tournamentTypes = [{ value: "team", label: "Đội" }];

  const tournamentVisibility = [
    { value: "public", label: "Công khai" },
    { value: "private", label: "Riêng tư" },
    { value: "unlisted", label: "Không liệt kê" },
  ];

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Thay thế bằng API upload thực tế của bạn
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url; // Giả sử API trả về { url: '...' }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Xử lý upload logo
  const handleLogoUpload: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }

    if (info.file.status === "done") {
      setUploading(false);
      const file = info.file.originFileObj;

      if (file) {
        // Tạo preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        try {
          // Upload lên server và lấy URL
          const imageUrl = await uploadImage(file);
          form.setFieldsValue({ logoUrl: imageUrl });
          message.success("Tải lên logo thành công");
        } catch (error) {
          message.error("Tải lên logo thất bại");
        }
      }
    }
  };

  // Xử lý upload banner
  const handleBannerUpload: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }

    if (info.file.status === "done") {
      setUploading(false);
      const file = info.file.originFileObj;

      if (file) {
        // Tạo preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setBannerPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        try {
          // Upload lên server và lấy URL
          const imageUrl = await uploadImage(file);
          form.setFieldsValue({ bannerUrl: imageUrl });
          message.success("Tải lên banner thành công");
        } catch (error) {
          message.error("Tải lên banner thất bại");
        }
      }
    }
  };

  // Hàm trước khi upload - kiểm tra file
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ có thể upload file ảnh!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }

    return true;
  };

  const handleTypeChange = (value: string) => {
    setTournamentType(value);
    if (value === "SOLO") {
      form.setFieldsValue({
        minTeamSize: undefined,
        maxTeamSize: undefined,
        allowIndividual: false,
      });
    }
  };

  const handleAllowIndividualChange = (checked: boolean) => {
    setAllowIndividual(checked);
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      if (logoFile && !values.logoUrl) {
        try {
          const logoUrl = await uploadImage(logoFile as any);
          values.logoUrl = logoUrl;
        } catch (error) {
          message.error("Lỗi upload logo");
          setLoading(false);
          return;
        }
      }

      if (bannerFile && !values.bannerUrl) {
        try {
          const bannerUrl = await uploadImage(bannerFile as any);
          values.bannerUrl = bannerUrl;
        } catch (error) {
          message.error("Lỗi upload banner");
          setLoading(false);
          return;
        }
      }

      const formatValues: TournamentBasicInfo = {
        ...values,
        registrationStart: values.registrationStart
          ? dayjs(values.registrationStart).toISOString()
          : undefined,
        registrationEnd: values.registrationEnd
          ? dayjs(values.registrationEnd).toISOString()
          : undefined,
        tournamentStart: values.tournamentStart
          ? dayjs(values.tournamentStart).toISOString()
          : undefined,
        tournamentEnd: values.tournamentEnd
          ? dayjs(values.tournamentEnd).toISOString()
          : undefined,
      };

      console.log("Form values:", formatValues);

      const res = await tournamentService.create(formatValues);
      if (res) {
        message.success("Tạo giải đấu thành công!");
        form.resetFields();
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo giải đấu");
      console.error("Error creating tournament:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateEndDate = (
    rule: any,
    value: Dayjs,
    callback: (error?: string) => void
  ) => {
    const startDate = form.getFieldValue("tournamentStart");
    if (value && startDate && value.isBefore(startDate)) {
      callback("Thời gian kết thúc phải sau thời gian bắt đầu");
    } else {
      callback();
    }
  };

  const validateRegistrationEndDate = (
    rule: any,
    value: Dayjs,
    callback: (error?: string) => void
  ) => {
    const startDate = form.getFieldValue("registrationStart");
    if (value && startDate && value.isBefore(startDate)) {
      callback("Thời gian kết thúc đăng ký phải sau thời gian bắt đầu đăng ký");
    } else {
      callback();
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <PlusCircleOutlined
                style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }}
              />
              <Title level={2}>Tạo Giải Đấu Mới</Title>
              <Text type="secondary">
                Bắt đầu với thông tin cơ bản, chi tiết có thể thiết lập sau
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                maxTeams: 0,
                type: "team",
                format: "SINGLE_ELIMINATION",
                visibility: "public",
                minTeamSize: 5,
                maxTeamSize: 7,
                allowIndividual: false,
                registrationFee: 0,
                prizePool: 0,
              }}
            >
              {/* Thông tin cơ bản */}
              <Title level={4} style={{ marginBottom: 16 }}>
                Thông tin cơ bản
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên giải đấu"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên giải đấu" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="VD: Giải đấu Liên Minh Huyền Thoại Mùa Hè 2026"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="game"
                    label="Game"
                    rules={[{ required: true, message: "Vui lòng chọn game" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn game"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {gameOptions.map((game) => (
                        <Option key={game} value={game} label={game}>
                          {game}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="type"
                    label="Loại giải đấu"
                    rules={[{ required: true, message: "Vui lòng chọn" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn loại giải đấu"
                      onChange={handleTypeChange}
                    >
                      {tournamentTypes.map((type) => (
                        <Option
                          key={type.value}
                          value={type.value}
                          selected={type.value === "team"}
                        >
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="format"
                    label="Định dạng giải đấu"
                    rules={[{ required: true, message: "Vui lòng chọn" }]}
                  >
                    <Select size="large" placeholder="Chọn định dạng">
                      {tournamentFormat.map((format) => (
                        <Option key={format.value} value={format.value}>
                          {format.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="visibility" label="Tầm nhìn">
                    <Select size="large" placeholder="Chọn tầm nhìn">
                      {tournamentVisibility.map((visibility) => (
                        <Option key={visibility.value} value={visibility.value}>
                          {visibility.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Mô tả */}
              <Form.Item name="description" label="Mô tả chi tiết">
                <TextArea
                  rows={4}
                  placeholder="Mô tả chi tiết về giải đấu, thể lệ, giải thưởng, quy định..."
                  maxLength={2000}
                  showCount
                />
              </Form.Item>

              {/* URL hình ảnh */}
              <Title level={5} style={{ marginBottom: 8 }}>
                Hình ảnh giải đấu
              </Title>
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 16 }}
              >
                Tải lên logo và banner cho giải đấu (Hỗ trợ: JPG, PNG, GIF, tối
                đa 5MB)
              </Text>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="logoUrl"
                    label="Logo giải đấu"
                    extra="Kích thước đề xuất: 200x200px"
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Upload
                          name="logo"
                          listType="picture-card"
                          showUploadList={false}
                          beforeUpload={beforeUpload}
                          onChange={handleLogoUpload}
                          disabled={uploading}
                          customRequest={({ file, onSuccess }) => {
                            // Lưu file vào state
                            setLogoFile(file as UploadFile);
                            if (onSuccess) onSuccess("ok");
                          }}
                        >
                          {logoPreview ? (
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              preview={false}
                            />
                          ) : (
                            <div>
                              <UploadOutlined />
                              <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                          )}
                        </Upload>
                      </div>

                      {logoPreview && (
                        <Button
                          type="link"
                          danger
                          onClick={() => {
                            setLogoPreview("");
                            setLogoFile(null);
                            form.setFieldsValue({ logoUrl: "" });
                          }}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="bannerUrl"
                    label="Banner giải đấu"
                    extra="Kích thước đề xuất: 1200x400px"
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Upload
                          name="banner"
                          listType="picture-card"
                          showUploadList={false}
                          beforeUpload={beforeUpload}
                          onChange={handleBannerUpload}
                          disabled={uploading}
                          customRequest={({ file, onSuccess }) => {
                            // Lưu file vào state
                            setBannerFile(file as UploadFile);
                            if (onSuccess) onSuccess("ok");
                          }}
                        >
                          {bannerPreview ? (
                            <Image
                              src={bannerPreview}
                              alt="Banner preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              preview={false}
                            />
                          ) : (
                            <div>
                              <UploadOutlined />
                              <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                          )}
                        </Upload>
                      </div>

                      {bannerPreview && (
                        <Button
                          type="link"
                          danger
                          onClick={() => {
                            setBannerPreview("");
                            setBannerFile(null);
                            form.setFieldsValue({ bannerUrl: "" });
                          }}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              {/* Vẫn giữ input URL cho backup */}
              <Row gutter={16} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <Form.Item name="logoUrl" hidden noStyle>
                    <Input placeholder="Hoặc nhập URL logo" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="bannerUrl" hidden noStyle>
                    <Input placeholder="Hoặc nhập URL banner" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              {/* Thời gian */}
              <Title level={4} style={{ marginBottom: 16 }}>
                Thời gian
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="registrationStart"
                    label="Thời gian bắt đầu đăng ký"
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Chọn thời gian"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="registrationEnd"
                    label="Thời gian kết thúc đăng ký"
                    rules={[{ validator: validateRegistrationEndDate }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Chọn thời gian"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="tournamentStart"
                    label="Thời gian bắt đầu giải đấu"
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Chọn thời gian"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="tournamentEnd"
                    label="Thời gian kết thúc giải đấu"
                    rules={[{ validator: validateEndDate }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Chọn thời gian"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              {/* Cài đặt đội/thí sinh */}
              <Title level={4} style={{ marginBottom: 16 }}>
                Cài đặt đội/thí sinh
              </Title>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="maxTeams"
                    label="Số đội/thí sinh tối đa"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng" },
                      { type: "number", min: 2, message: "Phải có ít nhất 2" },
                    ]}
                  >
                    <InputNumber
                      min={2}
                      max={512}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="VD: 8, 16, 32"
                    />
                  </Form.Item>
                </Col>

                {tournamentType === "TEAM" && (
                  <>
                    <Col span={8}>
                      <Form.Item
                        name="minTeamSize"
                        label="Số thành viên tối thiểu"
                        rules={[
                          {
                            type: "number",
                            min: 1,
                            message: "Phải có ít nhất 1",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          max={20}
                          style={{ width: "100%" }}
                          size="large"
                          placeholder="VD: 5"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="maxTeamSize"
                        label="Số thành viên tối đa"
                        rules={[
                          {
                            type: "number",
                            min: 1,
                            message: "Phải có ít nhất 1",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          max={20}
                          style={{ width: "100%" }}
                          size="large"
                          placeholder="VD: 7"
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>

              {tournamentType === "TEAM" && (
                <Form.Item
                  name="allowIndividual"
                  label="Cho phép đăng ký cá nhân"
                  valuePropName="checked"
                >
                  <Switch
                    onChange={handleAllowIndividualChange}
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </Form.Item>
              )}

              <Divider />

              {/* Tài chính */}
              <Title level={4} style={{ marginBottom: 16 }}>
                Tài chính
              </Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="registrationFee"
                    label="Phí đăng ký (đơn vị tiền)"
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="0"
                      addonAfter="VNĐ"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="prizePool"
                    label="Tổng giải thưởng (đơn vị tiền)"
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="0"
                      addonAfter="VNĐ"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<PlusCircleOutlined />}
                  style={{ width: "100%" }}
                >
                  Tạo Giải Đấu
                </Button>
              </Form.Item>

              <Text
                type="secondary"
                style={{ textAlign: "center", display: "block" }}
              >
                Bạn có thể thiết lập chi tiết vòng đấu, giải thưởng, quy định
                sau khi tạo
              </Text>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateTournamentPage;
