import {
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Row,
  Col,
  Card,
  message,
  Spin,
  Space,
  Avatar,
  Select,
  InputNumber,
} from 'antd';
import {
  UploadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { TournamentBasicInfo, TournamentStepProps } from '../../../common/types/tournament';
import type { UploadProps, UploadFile } from 'antd'; // Gộp các import type
import { tournamentService } from '@/services/tournamentService';
import { fileService } from '@/services/fileService';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { getGameByValue } from '@/components/tournament/games';
import GameSelect from '@/components/tournament/GameSelect';
import type { UploadState, FormBasicInfo} from '../../../common/types/tournament';
import { Option } from 'antd/es/mentions';

const { TextArea } = Input;

const tournamentFormat = [
  { value: 'SINGLE_ELIMINATION', label: 'Loại trực tiếp' },
  { value: 'DOUBLE_ELIMINATION', label: 'Loại đấu đôi' },
];
const tournamentTypes = [
  { value: 'team', label: 'Teams' },
  { value: 'solo', label: 'Solo' },
];

const TournamentBasicInfo: React.FC<TournamentStepProps> = ({ data, updateData }) => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const [uploadState, setUploadState] = useState<UploadState>({
    logoUploading: false,
    bannerUploading: false,
  });
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<ReturnType<typeof getGameByValue>>();
  console.log(data.basicInfo);
  useEffect(() => {
    if (data?.basicInfo) {
      const formValues: Partial<FormBasicInfo> = {
        ...data.basicInfo,
      };
      
      if (data.basicInfo.registrationStart) {
        formValues.registrationStart = dayjs(data.basicInfo.registrationStart);
      }
    
      if (data.basicInfo.registrationEnd) {
        formValues.registrationEnd = dayjs(data.basicInfo.registrationEnd);
      }
    
      if (data.basicInfo.tournamentStart) {
        formValues.tournamentStart = dayjs(data.basicInfo.tournamentStart);
      }
      
      form.setFieldsValue(formValues);

      // Set initial file list for display
      if (data.basicInfo.logoUrl) {
        setUploadState(prev => ({
          ...prev,
          logoFile: {
            uid: '-1',
            name: 'logo.png',
            status: 'done',
            url: data.basicInfo!.logoUrl,
          } as UploadFile,
        }));
      }

      if (data.basicInfo.bannerUrl) {
        setUploadState(prev => ({
          ...prev,
          bannerFile: {
            uid: '-2',
            name: 'banner.png',
            status: 'done',
            url: data.basicInfo!.bannerUrl,
          } as UploadFile,
        }));
      }
    } else {
      // Reset form nếu không có data
      form.resetFields();
      setUploadState({
        logoUploading: false,
        bannerUploading: false,
      });
    }
  }, [data, form]);

  // Upload image và lấy signed URL
  const uploadImage = async (file: File, type: 'logo' | 'banner'): Promise<string> => {
    try {
      // Update upload state
      if (type === 'logo') {
        setUploadState(prev => ({ ...prev, logoUploading: true }));
      } else {
        setUploadState(prev => ({ ...prev, bannerUploading: true }));
      }

      // 1. Upload file lên server
      const uploadResult = await fileService.upload(file);
      
      if (!uploadResult.filename) {
        throw new Error('Upload failed');
      }
      
      // 2. Lấy signed URL cho file vừa upload
      const publicUrl = await fileService.getPublicUrl(uploadResult.filename);
      
      if (type === 'logo') {
        setUploadState(prev => ({ ...prev, logoUploading: false }));
      } else {
        setUploadState(prev => ({ ...prev, bannerUploading: false }));
      }

      return publicUrl.publicUrl;
    } catch (error) {
      if (type === 'logo') {
        setUploadState(prev => ({ ...prev, logoUploading: false }));
      } else {
        setUploadState(prev => ({ ...prev, bannerUploading: false }));
      }
      throw error;
    }
  };

  // Handle logo upload
  const handleLogoUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const signedUrl = await uploadImage(file as File, 'logo');
      
      // Update form value với signed URL
      form.setFieldsValue({ logoUrl: signedUrl });
      
      // Update upload state
      setUploadState(prev => ({
        ...prev,
        logoFile: {
          name: (file as File).name,
          status: 'done',
          url: signedUrl,
        } as UploadFile,
      }));
      
      onSuccess?.(signedUrl);
      message.success('Upload logo thành công!');
    } catch (error) {
      message.error('Upload logo thất bại!');
      onError?.(error as Error);
    }
  };

  // Handle banner upload
  const handleBannerUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    
    try {
      const signedUrl = await uploadImage(file as File, 'banner');
      
      // Update form value với signed URL
      form.setFieldsValue({ bannerUrl: signedUrl });
      
      // Update upload state
      setUploadState(prev => ({
        ...prev,
        bannerFile: {
          name: (file as File).name,
          status: 'done',
          url: signedUrl,
        } as UploadFile,
      }));
      
      onSuccess?.(signedUrl);
      message.success('Upload banner thành công!');
    } catch (error) {
      message.error('Upload banner thất bại!');
      onError?.(error as Error);
    }
  };

  const handleGameChange = (value: string, game?: any) => {
    setSelectedGame(game);
    form.setFieldsValue({ game: value });
  };

  // Handle file change for logo
  const handleLogoChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'removed') {
      form.setFieldsValue({ logoUrl: '' });
      setUploadState(prev => ({ ...prev, logoFile: undefined }));
    }
  };

  // Handle file change for banner
  const handleBannerChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'removed') {
      form.setFieldsValue({ bannerUrl: '' });
      setUploadState(prev => ({ ...prev, bannerFile: undefined }));
    }
  };

  // Validate file before upload
  const beforeUpload = (file: File, type: 'logo' | 'banner'): boolean => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(`Vui lòng chọn file ảnh cho ${type === 'logo' ? 'logo' : 'banner'}!`);
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error(`Ảnh ${type === 'logo' ? 'logo' : 'banner'} không được vượt quá 5MB!`);
      return false;
    }
    return true;
  };

  const onFinish = async (values: FormBasicInfo) => {
    setLoading(true);
    
    try {
      // Convert dates to ISO string
      const processedValues: Partial<TournamentBasicInfo> = {
        ...values,
      };

      // Chỉ chuyển đổi nếu có giá trị
      if (values.registrationStart) {
        processedValues.registrationStart = dayjs(values.registrationStart);
      }
      
      if (values.registrationEnd) {
        processedValues.registrationEnd = dayjs(values.registrationEnd);
      }
      
      if (values.tournamentStart) {
        processedValues.tournamentStart = dayjs(values.tournamentStart);
      }

      // Ensure logoUrl and bannerUrl are included
      const formValues = form.getFieldsValue();
      if (formValues.logoUrl) {
        processedValues.logoUrl = formValues.logoUrl;
      }
      if (formValues.bannerUrl) {
        processedValues.bannerUrl = formValues.bannerUrl;
      }

      if (id) {
        const res = await tournamentService.update(id, processedValues);
        if (!res) return;
        
        message.success("Cập nhật thông tin thành công!");
        updateData('basicInfo', processedValues);
      } else {
        message.error("Không tìm thấy id!");
      }
    } catch (error) {
      message.error("Có lỗi khi cập nhật giải đấu. " + error);
    } finally {
      setLoading(false);
    }
  };

  // Upload props for logo
  const logoUploadProps: UploadProps = {
    accept: 'image/*',
    listType: "picture" as const,
    maxCount: 1,
    fileList: uploadState.logoFile ? [uploadState.logoFile] : [],
    customRequest: handleLogoUpload,
    onChange: handleLogoChange,
    beforeUpload: (file) => beforeUpload(file as File, 'logo'),
    onRemove: () => {
      form.setFieldsValue({ logoUrl: '' });
      return true;
    },
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
  };

  // Upload props for banner
  const bannerUploadProps: UploadProps = {
    accept: 'image/*',
    listType: "picture" as const,
    maxCount: 1,
    fileList: uploadState.bannerFile ? [uploadState.bannerFile] : [],
    customRequest: handleBannerUpload,
    onChange: handleBannerChange,
    beforeUpload: (file) => beforeUpload(file as File, 'banner'),
    onRemove: () => {
      form.setFieldsValue({ bannerUrl: '' });
      return true;
    },
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Card title="Thông tin chung" size="small">
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên giải đấu"
                    rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu' }]}
                  >
                    <Input placeholder="VD: Giải đấu Liên Minh Huyền Thoại Mùa Hè 2026" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="game"
                    label="Game"
                    rules={[{ required: true, message: 'Vui lòng chọn game' }]}
                  >
                    <GameSelect
                      value={form.getFieldValue('game')}
                      onChange={handleGameChange}
                      placeholder="Chọn game"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  
                  {/* Hiển thị thông tin game đã chọn */}
                  {selectedGame && (
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '8px', 
                      backgroundColor: '#fafafa', 
                      borderRadius: '4px',
                      border: '1px solid #f0f0f0'
                    }}>
                      <Space>
                        <Avatar
                          src={selectedGame.logo} 
                          size="small"
                          style={{ backgroundColor: '#fff', padding: '2px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{selectedGame.name}</div>
                          {selectedGame.description && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {selectedGame.description}
                            </div>
                          )}
                        </div>
                      </Space>
                    </div>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Thể thức" size="small">
              <Form.Item
                    name="format"
                    label="Thể thức giải đấu"
                    rules={[{ required: true, message: 'Vui lòng chọn' }]}
                  >
                    <Select size="large" placeholder="Chọn thể thức giải đấu">
                      {tournamentFormat.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

             <Form.Item
                    name="type"
                    label="Tham gia dưới dạng"
                    rules={[{ required: true, message: 'Vui lòng chọn' }]}
                  >
                    <Select size="large" placeholder="Chọn loại giải đấu">
                      {tournamentTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          {type.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                   <Form.Item
                name="maxTeams"
                label="Số đội/thí sinh tối đa"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng' },
                  { type: 'number', min: 2, message: 'Phải có ít nhất 2' }
                ]}
              >
                <InputNumber
                  min={2} 
                  max={512} 
                  style={{ width: '100%' }}
                  size="large"
                  // placeholder="VD: 8, 16, 32, 64..."
                />
              </Form.Item>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Thời gian" size="small">
              <Form.Item
                name="registrationStart"
                label="Bắt đầu đăng ký"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                />
              </Form.Item>

              <Form.Item
                name="registrationEnd"
                label="Kết thúc đăng ký"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                />
              </Form.Item>

              <Form.Item
                name="tournamentStart"
                label="Bắt đầu giải đấu"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY HH:mm"
                />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            
            <Card title="Hình ảnh" size="small">
                   <Form.Item name="logoUrl" label="Logo giải đấu" hidden>
                <Input type="hidden" />
              </Form.Item>
              
              <Form.Item label="Logo giải đấu">
                <Upload {...logoUploadProps}>
                  <Button 
                    icon={uploadState.logoUploading ? <LoadingOutlined /> : <UploadOutlined />}
                    disabled={uploadState.logoUploading}
                  >
                    {uploadState.logoUploading ? 'Đang tải lên...' : 'Tải lên logo'}
                  </Button>
                </Upload>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF, SVG
                </div>
              </Form.Item>

                <Form.Item name="bannerUrl" label="Banner giải đấu" hidden>
                <Input type="hidden" />
              </Form.Item>

              <Form.Item label="Banner giải đấu">
                <Upload {...bannerUploadProps}>
                  <Button 
                    icon={uploadState.bannerUploading ? <LoadingOutlined /> : <UploadOutlined />}
                    disabled={uploadState.bannerUploading}
                  >
                    {uploadState.bannerUploading ? 'Đang tải lên...' : 'Tải lên banner'}
                  </Button>
                </Upload>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF
                </div>
              </Form.Item>   
            </Card>
          </Col>
          
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả giải đấu"
            >
              <TextArea 
                rows={4} 
                placeholder="Mô tả chi tiết về giải đấu, thể lệ, mục tiêu..."
                maxLength={2000}
                showCount
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu và tiếp tục
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default TournamentBasicInfo;