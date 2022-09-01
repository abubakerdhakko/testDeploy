import {FormFieldErrors} from "@/shared/ErrorCodes";

export const Functions = {

  getFormFieldErrorMessage(fieldValidation){
    //console.log(fieldValidation)
    const validationParameters =fieldValidation.$params;
    let errorMessage = '';
    if(fieldValidation.$error){
      if(validationParameters[FormFieldErrors.required.code] && !fieldValidation[FormFieldErrors.required.code]){
        errorMessage=FormFieldErrors.required.message;
      }
      if(validationParameters[FormFieldErrors.minLength.code] && !fieldValidation[FormFieldErrors.minLength.code]){
        errorMessage +=FormFieldErrors.minLength.message+validationParameters[FormFieldErrors.minLength.code].min+' ';
      }
      if(validationParameters[FormFieldErrors.maxLength.code] && !fieldValidation[FormFieldErrors.maxLength.code]){
        errorMessage +=FormFieldErrors.maxLength.message+validationParameters[FormFieldErrors.maxLength.code].max+' ';
      }
      if(validationParameters[FormFieldErrors.minValue.code] && !fieldValidation[FormFieldErrors.minValue.code]){
        errorMessage +=FormFieldErrors.minValue.message+validationParameters[FormFieldErrors.minValue.code].min+' ';
      }
      if(validationParameters[FormFieldErrors.maxValue.code] && !fieldValidation[FormFieldErrors.maxValue.code]){
        errorMessage +=FormFieldErrors.maxValue.message+validationParameters[FormFieldErrors.maxValue.code].max+' ';
      }


      //if no validation type found, then return default
      if(!errorMessage){
        errorMessage= FormFieldErrors.default.message
      }
    }
    return errorMessage;
  },
  
  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

}