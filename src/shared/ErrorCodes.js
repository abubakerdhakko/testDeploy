export const FormFieldErrors = {
  default:{
    message: 'Invalid field. '
  },
  required: {
    code: 'required',
    message:'Required field. '
  },
  minLength: {
    code: 'minLength',
    message:'Min length: '//caller of this property has to append required length in message
  },
  maxLength: {
    code: 'maxLength',
    message:'Max length: '//caller of this property has to append required length in message
  },
  minValue: {
    code: 'minValue',
    message:'Min No.:'//caller of this property has to append required number in message
  },
  maxValue: {
    code: 'maxValue',
    message:'Max No.: '//caller of this property has to append required number in message
  },

}

export  const ResponseErrors = {

}