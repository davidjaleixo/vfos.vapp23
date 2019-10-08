
import { FormGroup } from '@angular/forms';




export function dateDependecyValidator(lowerDate: string, biggerDate: string) {
    return (fg: FormGroup) => {
        console.log("Validating dependecy dates... ");
        
        
        const bigger = fg.controls[biggerDate];
        
        if(fg.controls[lowerDate].value == null || fg.controls[lowerDate].value == 'None'){
            return
        }
        const lower = fg.controls[lowerDate].value.edate;

        //check if other validator already catched the error
        if(bigger.errors && !bigger.errors.mustBeBigger){
            return;
        }
        if ((lower !== null && bigger !== null) && bigger.value < lower) {
            bigger.setErrors({ mustBeBigger: true, mustBeBiggerTip: lower })
        }else{
            bigger.setErrors(null)
        }
    }
}