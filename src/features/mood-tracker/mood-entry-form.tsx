import { Modal, Radio, Typography, Space } from "antd";
import { MehOutlined, FrownOutlined, SmileOutlined } from "@ant-design/icons";
import { MoodValue } from "../../domain/mood";
import { useMoodData } from "./useMoodData";

const { Text } = Typography;

interface MoodEntryFormProps {
  open: boolean;
  onClose: () => void;
  currentMood?: MoodValue;
}

const moodOptions = [
  {
    value: 1,
    label: (
      <Space>
        <FrownOutlined className="text-red-500 text-xl" /> <Text>Bad</Text>
      </Space>
    ),
  },
  {
    value: 2,
    label: (
      <Space>
        <MehOutlined className="text-yellow-500 text-xl" /> <Text>Neutral</Text>
      </Space>
    ),
  },
  {
    value: 3,
    label: (
      <Space>
        <SmileOutlined className="text-green-500 text-xl" /> <Text>Good</Text>
      </Space>
    ),
  },
] as const;

export function MoodEntryForm({
  open,
  onClose,
  currentMood,
}: MoodEntryFormProps) {
  const today = new Date().toISOString().split("T")[0] + "T00:00:00Z";
  const { updateMoodData, isUpdating } = useMoodData();

  const handleSubmit = (mood: MoodValue) => {
    updateMoodData({ mood, day: today });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="How are you feeling today?"
      onCancel={onClose}
      footer={null}
      centered
      maskClosable={false}
    >
      <div className="py-6">
        <Radio.Group
          defaultValue={currentMood}
          size="large"
          className="w-full"
          disabled={isUpdating}
        >
          <Space direction="vertical" className="w-full">
            {moodOptions.map((option) => (
              <Radio.Button
                key={option.value}
                value={option.value}
                onClick={() => handleSubmit(option.value)}
                className="w-full text-center h-12 flex items-center justify-center"
              >
                {option.label}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
}
