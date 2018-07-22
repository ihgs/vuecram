const person = {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      label: 'Family Name',
      model: 'familyName'
    },
    {
      type: 'input',
      inputType: 'text',
      label: 'First Name',
      model: 'firstName'
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
      inputType: 'date',
      label: 'Birthday',
      model: 'birthday'
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
      type: 'array',
      label: 'Card ID',
      model: 'cardIds',
      showRemoveButton: true
    }
  ]
}

const school = {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      label: 'School',
      model: 'schoolId'
    }
  ]
}
export default { person, card, school }
