// components/TaskFormModal.tsx
import { Modal, Form, Input } from "antd";
import { useTasks } from "./useTasks";

interface TaskFormValues {
  title: string;
  description: string;
}

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
}

export const TaskFormModal = ({ open, onClose }: TaskFormModalProps) => {
  const { addTask } = useTasks();
  const [form] = Form.useForm<TaskFormValues>();

  const onFinish = (values: TaskFormValues) => {
    addTask({
      title: values.title,
      description: values.description,
      completed: false,
    });
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Add New Task"
      onCancel={onClose}
      footer={null}
      centered
      maskClosable={false}
    >
      <Form form={form} onFinish={onFinish} layout="vertical" className="py-6">
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter a task title",
              whitespace: true,
            },
          ]}
          className="mb-3"
        >
          <Input
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 text-base rounded-md"
            autoFocus
          />
        </Form.Item>

        <Form.Item
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter a task description",
              whitespace: true,
            },
          ]}
          className="mb-6"
        >
          <Input.TextArea
            placeholder="Add some details..."
            className="w-full px-3 py-2 text-base rounded-md"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 
                     rounded-md hover:bg-gray-50 active:bg-gray-100 
                     transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white 
                     rounded-md hover:bg-blue-600 active:bg-blue-700 
                     transition-colors duration-200"
          >
            Add Task
          </button>
        </div>
      </Form>
    </Modal>
  );
};
