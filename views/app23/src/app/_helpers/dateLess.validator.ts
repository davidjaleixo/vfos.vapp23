
import { AbstractControl, FormGroup } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';



export function dateLessValidator(lowerDate: string, biggerDate: string) {
    return (fg: FormGroup) => {
        const lower = fg.controls[lowerDate];
        const bigger = fg.controls[biggerDate];
        
        //check if other validator already catched the error
        if(bigger.errors && !bigger.errors.mustBeBigger){
            return;
        }
        if ((lower !== null && bigger !== null) && bigger.value < lower.value) {
            bigger.setErrors({ mustBeBigger: true })
        }else{
            bigger.setErrors(null);
        }
    }
}