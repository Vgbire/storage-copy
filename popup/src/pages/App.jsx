import './style.scss'
import { Form, Input, Select } from '@arco-design/web-react'

function App() {
  const [form] = Form.useForm()

  chrome.storage.sync.get('websiteConfigs', (data) => {
    form.setFieldsValue(data.websiteConfigs)
  })

  function formChange() {
    chrome.storage.sync.set({ websiteConfigs: form.getFieldsValue() })
  }

  const storageOptions = [
    { label: 'Local Storage', value: 'localStorage' },
    { label: 'Session Storage', value: 'SessionStorage' },
    { label: 'Cookie', value: 'cookie' },
  ]

  return (
    <div className="popup-container">
      <Form
        form={form}
        initialValues={form.getFieldsValue()}
        onChange={formChange}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item field="fromDomain" label="From Domain">
          <Input allowClear />
        </Form.Item>
        <Form.Item field="toDomain" label="To Domain">
          <Input allowClear />
        </Form.Item>
        <Form.Item field="storage" label="Storage">
          <Select options={storageOptions} allowClear />
        </Form.Item>
        <Form.Item field="field" label="field">
          <Input allowClear />
        </Form.Item>
      </Form>
    </div>
  )
}

export default App
