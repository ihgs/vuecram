import VueFormGenerator from 'vue-form-generator'
const validators = VueFormGenerator.validators
const base = {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      label: 'Family Name',
      model: 'familyName',
      validator: [validators.string],
      required: true
    },
    {
      type: 'input',
      inputType: 'text',
      label: 'First Name',
      model: 'firstName',
      validator: [validators.string],
      required: true
    },
    {
      type: 'input',
      inputType: 'text',
      label: 'Family Name(かな)',
      model: 'familyNameKana'
    },
    {
      type: 'input',
      inputType: 'text',
      label: 'First Name(かな)',
      model: 'firstNameKana'
    },
    {
      type: 'input',
      inputType: 'text',
      label: 'Birthday',
      model: 'birthday',
      validator: [ validators.regexp ],
      pattern: '\\d{4}-\\d{1,2}-\\d{1,2}',
      hint: '入力形式: 2018-01-01'
    }
  ]
}

const card = {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      label: 'Mail',
      model: 'mail'
    },
    {
      type: 'input',
      inputType: 'text',
      label: 'Card ID',
      model: 'cardId'
    }
  ]
}

const school = {
  fields: [
    {
      type: 'select',
      label: 'School',
      model: 'id'
    },
    {
      type: 'input',
      inputType: 'number',
      placeholder: '入学年度',
      model: 'enteranceYear'
    },
    {
      type: 'textArea',
      placeholder: 'memo',
      model: 'memo'
    },
    {
      type: 'checkbox',
      label: '卒業',
      model: 'graduated'
    }
  ]
}
export default { base, card, school }
