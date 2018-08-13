import VueFormGenerator from 'vue-form-generator'
const validators = VueFormGenerator.validators
const school = {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      label: 'School Name',
      model: 'name',
      validator: [validators.string],
      required: true
    },
    {
      type: 'select',
      label: 'School Type',
      model: 'kind',
      required: true,
      values: [
        '小学校',
        '中学校',
        '高校'
      ],
      validator: [validators.required]
    }
  ]
}

export default { school }
