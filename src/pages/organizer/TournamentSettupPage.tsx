// frontend/src/pages/organizer/TournamentSetupPage.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Button,
  message,
  Row,
  Col,
  Typography,
  Space,
  Steps,
  Spin,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  SaveOutlined,
  SettingOutlined,
  TrophyOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import TournamentBasicSettings from "./TournamentSettings";
import TournamentStages from "./TournamentStages";
import TournamentRegistration from "./TournamentRegistration";
import TournamentRules from "./TournamentRules";
import TournamentOverview from "./TournamentOverview";
import TournamentBasicInfo from "./TournamentBasicInfo";
import { tournamentService } from "@/services/tournamentService";
import type {
  TournamentData,
  TournamentDataKey,
  TournamentApiResponse,
  PublishTournamentRequest,
} from "@/common/types/tournament";
import { Dayjs } from "dayjs";
import { withTabNavigation } from "@/components/tournament/withTabNavigation";

const { Title, Text } = Typography;
const { Step } = Steps;
const { confirm } = Modal;

const TournamentSetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(
    null
  );
  const [originalData, setOriginalData] =
    useState<TournamentApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validation functions
  const validateBasicInfo = (data: TournamentData): boolean => {
    const basicInfo = data.basicInfo;
    if (!basicInfo) return false;

    const requiredFields = [
      "name",
      "game",
      "format",
      "type",
      "maxTeams",
      "registrationStart",
      "registrationEnd",
      "tournamentStart",
    ];

    return requiredFields.every((field) => {
      const value = basicInfo[field as keyof TournamentBasicInfo];
      if (field === "maxTeams") {
        return typeof value === "number" && value >= 2;
      }
      return value !== undefined && value !== null && value !== "";
    });
  };

  const validateSettings = (data: TournamentData): boolean => {
    const settings = data.settings;
    return !!(settings?.maxTeams && settings.maxTeams >= 2);
  };

  const validateStages = (data: TournamentData): boolean => {
    const stages = data.stages;
    return stages && stages.length > 0;
  };

  // Định nghĩa tabs với withTabNavigation
  const tabs = [
    {
      key: "basic",
      label: "Thông tin cơ bản",
      icon: <TagOutlined />,
      component: withTabNavigation(TournamentBasicInfo, "settings", {
        validateBeforeNext: validateBasicInfo,
      }),
    },
    {
      key: "settings",
      label: "Cài đặt giải đấu",
      icon: <SettingOutlined />,
      component: withTabNavigation(TournamentBasicSettings, "stages", {
        validateBeforeNext: validateSettings,
      }),
    },
    {
      key: "stages",
      label: "Vòng đấu",
      icon: <TrophyOutlined />,
      component: withTabNavigation(TournamentStages, "registrations", {
        validateBeforeNext: validateStages,
      }),
    },
    {
      key: "registrations",
      label: "Đăng ký",
      icon: <TeamOutlined />,
      component: withTabNavigation(TournamentRegistration, "rules"),
    },
    {
      key: "rules",
      label: "Quy định",
      icon: <FileTextOutlined />,
      component: TournamentRules,
    },
    {
      key: "overview",
      label: "Tổng quan",
      icon: <EyeOutlined />,
      component: TournamentOverview,
    },
  ];

  useEffect(() => {
    if (id) {
      loadTournamentData();
    } else {
      setTournamentData({
        basicInfo: {
          id: "",
          name: "",
          game: "",
          description: "",
          registrationStart: new Dayjs(),
          registrationEnd: new Dayjs(),
          tournamentStart: new Dayjs(),
          tournamentEnd: new Dayjs(),
        },
        settings: {},
        stages: [],
        rules: [],
        registrations: [],
      });
      setInitialLoading(false);
      setHasUnsavedChanges(true);
    }
  }, [id]);

  const loadTournamentData = async () => {
    setInitialLoading(true);
    try {
      if (!id) return;
      const res = await tournamentService.getForSetup(id);
      let data;
      if (res.success) {
        data = res.data;
      }
      console.log("data: ", data);
      const mappedData: TournamentData = {
        basicInfo: {
          id: data.id,
          name: data.name,
          game: data.game,
          description: data.description || "",
          logoUrl: data.logoUrl || "",
          bannerUrl: data.bannerUrl || "",
          registrationStart: data.registrationStart || "",
          registrationEnd: data.registrationEnd || "",
          tournamentStart: data.tournamentStart || "",
          tournamentEnd: data.tournamentEnd || "",
          maxTeams: data.maxTeams,
          format: data.format,
          type: data.type,
        },
        settings: {
          type: data.type as any,
          maxTeams: data.maxTeams,
          minTeamSize: data.minTeamSize,
          maxTeamSize: data.maxTeamSize,
          allowIndividual: data.allowIndividual,
          visibility: data.visibility as any,
          registrationFee: parseFloat(data.registrationFee) || 0,
          prizePool: parseFloat(data.prizePool) || 0,
          prizeGuaranteed: data.prizeGuaranteed,
        },
        stages: data.stages || [],
        rules: data.rules || [],
        registrations: data.registrations || [],
      };

      setTournamentData(mappedData);
      setOriginalData(data);
      setHasUnsavedChanges(false);

      // Xác định tab active dựa trên dữ liệu đã hoàn thành
      determineActiveTab(mappedData);
    } catch (error) {
      message.error("Không tìm thấy dữ liệu giải đấu");
      console.error("Error loading tournament:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Hàm xác định tab active dựa trên dữ liệu đã hoàn thành
  const determineActiveTab = (data: TournamentData) => {
    const tabOrder = [
      "basic",
      "settings",
      "stages",
      "registrations",
      "rules",
      "overview",
    ];

    // Kiểm tra xem tab nào chưa hoàn thành
    for (let i = 0; i < tabOrder.length; i++) {
      const tabKey = tabOrder[i];
      if (!isTabCompleted(tabKey, data)) {
        setActiveTab(tabKey);
        return;
      }
    }

    // Nếu tất cả đã hoàn thành, chọn tab tổng quan
    setActiveTab("overview");
  };

  // Hàm kiểm tra xem tab đã hoàn thành chưa
  const isTabCompleted = (tabKey: string, data: TournamentData): boolean => {
    switch (tabKey) {
      case "basic":
        return validateBasicInfo(data);

      case "settings":
        return validateSettings(data);

      case "stages":
        // Kiểm tra đã có vòng đấu chưa
        return data.stages && data.stages.length > 0;

      case "registrations":
        // Kiểm tra cài đặt đăng ký
        return true;

      case "rules":
        // Kiểm tra quy định
        return true;

      case "overview":
        return false;

      default:
        return false;
    }
  };

  // Hàm kiểm tra xem có thể truy cập tab không
  const canAccessTab = (tabKey: string, data: TournamentData): boolean => {
    const tabOrder = [
      "basic",
      "settings",
      "stages",
      "registrations",
      "rules",
      "overview",
    ];
    const tabIndex = tabOrder.indexOf(tabKey);

    // Tab đầu tiên luôn có thể truy cập
    if (tabIndex === 0) return true;

    // Kiểm tra tất cả các tab trước đó đã hoàn thành chưa
    for (let i = 0; i < tabIndex; i++) {
      if (!isTabCompleted(tabOrder[i], data)) {
        return false;
      }
    }

    return true;
  };

  const handleTabChange = (newTab: string) => {
    if (isProcessing) {
      message.warning("Vui lòng đợi hoàn tất thao tác trước khi chuyển tab");
      return;
    }

    // Kiểm tra validation nếu chuyển sang tab phía sau
    const currentTabIndex = tabs.findIndex((tab) => tab.key === activeTab);
    const newTabIndex = tabs.findIndex((tab) => tab.key === newTab);

    if (newTabIndex > currentTabIndex) {
      // Kiểm tra xem có thể truy cập tab mới không
      if (tournamentData && !canAccessTab(newTab, tournamentData)) {
        message.error(
          "Vui lòng hoàn thành bước trước đó trước khi chuyển sang bước này"
        );
        return;
      }
    }

    if (hasUnsavedChanges) {
      confirm({
        title: "Có thay đổi chưa lưu",
        icon: <ExclamationCircleOutlined />,
        content:
          "Bạn có thay đổi chưa lưu. Bạn có muốn lưu trước khi chuyển tab?",
        okText: "Lưu và chuyển",
        cancelText: "Chuyển không lưu",
        onOk: async () => {
          await handleSaveDraft();
          setActiveTab(newTab);
        },
        onCancel: () => {
          setActiveTab(newTab);
        },
      });
    } else {
      setActiveTab(newTab);
    }
  };

  const handleSaveDraft = async () => {
    if (!tournamentData) return;

    setLoading(true);
    setIsProcessing(true);
    try {
      if (id) {
        // await tournamentService.saveDraft(id);
      }

      message.success("Đã lưu bản nháp");
      setHasUnsavedChanges(false);
      if (id && tournamentData) {
        setOriginalData({
          ...originalData,
          name: tournamentData.basicInfo.name,
          game: tournamentData.basicInfo.game,
        } as TournamentApiResponse);
      }
    } catch (error: any) {
      message.error(`Lỗi khi lưu bản nháp: ${error.message}`);
      setHasUnsavedChanges(true);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    if (!tournamentData || !id) return;

    // Kiểm tra xem tất cả các bước đã hoàn thành chưa
    const requiredTabs = ["basic", "settings", "stages"];
    for (const tabKey of requiredTabs) {
      if (!isTabCompleted(tabKey, tournamentData)) {
        const tabName = tabs.find((t) => t.key === tabKey)?.label || tabKey;
        message.error(
          `Vui lòng hoàn thành phần "${tabName}" trước khi xuất bản`
        );
        setActiveTab(tabKey);
        return;
      }
    }

    if (hasUnsavedChanges) {
      confirm({
        title: "Có thay đổi chưa lưu",
        icon: <ExclamationCircleOutlined />,
        content:
          "Bạn có thay đổi chưa lưu. Bạn có muốn lưu trước khi xuất bản?",
        okText: "Lưu và xuất bản",
        cancelText: "Hủy",
        onOk: async () => {
          await handleSaveDraft();
          await publishTournament();
        },
      });
      return;
    }

    confirm({
      title: "Xác nhận xuất bản giải đấu",
      icon: <ExclamationCircleOutlined />,
      content:
        "Giải đấu sẽ được hiển thị công khai sau khi xuất bản. Bạn có chắc chắn?",
      onOk: async () => {
        await publishTournament();
      },
    });
  };

  const publishTournament = async () => {
    if (!tournamentData || !id) return;

    setLoading(true);
    try {
      const publishData: PublishTournamentRequest = {
        id,
        status: "PUBLISHED",
      };

      await tournamentService.publishTournament(id, publishData);
      message.success("Giải đấu đã được xuất bản!");
      navigate("/tournaments");
    } catch (error: any) {
      message.error(`Lỗi khi xuất bản giải đấu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateTournamentData = async (key: TournamentDataKey, data: any) => {
    if (!tournamentData) return;

    setHasUnsavedChanges(false);

    const updatedData = {
      ...tournamentData,
      [key]: data,
    };
    setTournamentData(updatedData as TournamentData);

    if (isProcessing) return;

    if (id && !isProcessing) {
      setLoading(true);
      try {
        // message.success('Đã cập nhật thông tin');
      } catch (error: any) {
        message.error(`Lỗi khi cập nhật: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (isProcessing) {
      message.warning("Vui lòng đợi hoàn tất thao tác trước khi rời đi");
      return;
    }

    if (hasUnsavedChanges) {
      confirm({
        title: "Có thay đổi chưa lưu",
        icon: <ExclamationCircleOutlined />,
        content: "Bạn có thay đổi chưa lưu. Bạn có muốn lưu trước khi rời đi?",
        okText: "Lưu và rời đi",
        cancelText: "Rời đi không lưu",
        cancelButtonProps: { danger: true },
        onOk: async () => {
          await handleSaveDraft();
          navigate("/tournaments/mine");
        },
        onCancel: () => {
          navigate("/tournaments/mine");
        },
      });
    } else {
      navigate("/tournaments/mine ");
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: 16 }}>
          Đang tải thông tin giải đấu...
        </Title>
      </div>
    );
  }

  if (!tournamentData) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Title level={3}>Không tìm thấy giải đấu</Title>
        <Button type="primary" onClick={() => navigate("/tournaments/create")}>
          Tạo giải đấu mới
        </Button>
      </div>
    );
  }

  const CurrentComponent = tabs.find((tab) => tab.key === activeTab)?.component;

  // Tính toán số bước đã hoàn thành
  const completedSteps =
    tabs.filter((tab) => isTabCompleted(tab.key, tournamentData)).length - 1;
  const currentStep = Math.min(completedSteps, tabs.length - 1);

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                disabled={loading || isProcessing}
              >
                Quay lại
              </Button>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {tournamentData.basicInfo?.name || "Chưa có tên"}
                </Title>
                <Text type="secondary">
                  {tournamentData.basicInfo?.game || "Chưa chọn game"} •
                  {tournamentData.settings?.type
                    ? ` ${tournamentData.settings.type}`
                    : " Chưa chọn thể thức"}
                  {id && ` • ID: ${id}`}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              {hasUnsavedChanges && (
                <Text type="warning" style={{ marginRight: 8 }}>
                  Có thay đổi chưa lưu
                </Text>
              )}
              {isProcessing && <Spin size="small" style={{ marginRight: 8 }} />}
              <Button
                icon={<SaveOutlined />}
                loading={loading}
                onClick={handleSaveDraft}
                disabled={!hasUnsavedChanges || isProcessing}
              >
                Lưu nháp
              </Button>
              {id && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={loading}
                  onClick={handlePublish}
                  disabled={
                    !id ||
                    isProcessing ||
                    !isTabCompleted("stages", tournamentData)
                  }
                >
                  Xuất bản
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <div style={{ marginBottom: 24 }}>
          <Steps current={currentStep} size="small">
            {tabs.map((tab) => (
              <Step
                key={tab.key}
                title={tab.label}
                status={
                  isTabCompleted(tab.key, tournamentData) ? "finish" : "wait"
                }
              />
            ))}
          </Steps>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={tabs.map((tab) => ({
            key: tab.key,
            label: (
              <span>
                {tab.icon} {tab.label}
                {isTabCompleted(tab.key, tournamentData) && (
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", marginLeft: 8 }}
                  />
                )}
              </span>
            ),
            disabled: tournamentData
              ? !canAccessTab(tab.key, tournamentData)
              : true,
            children:
              tournamentData && CurrentComponent
                ? React.createElement(CurrentComponent, {
                    data: tournamentData,
                    updateData: updateTournamentData,
                    setActiveTab: setActiveTab,
                  })
                : null,
          }))}
        />
      </Card>
    </div>
  );
};

export default TournamentSetupPage;
