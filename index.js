var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL ="/api/irl";
var empDBName = "SCHOOL-DB";
var empRelationName ="STUDENT-TABLE";
var connToken ="90932949|-31949275094480169|90947745";

$('#rollno').focus();

function resetForm() {
    $('#rollno').val("");
    $('#name').val("");
    $('#cls').val("");
    $('#dob').val("");
    $('#address').val("");
    $('#enr-date').val("");
    $('#rollno').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $('#rollno').focus();

}

function validateData() {
    var rollno , name , cls , dob , address , enrdate;
    rollno=$('#rollno').val();
    name=$('#name').val();
    cls=$('#cls').val();
    dob= $('#dob').val();
    address=$('#address').val();
    enrdate= $('#enr-date').val();

    if(rollno==''){
        alert('Roll no missing');
        $("#rollno").focus();
        return "";
    }
    if(name==''){
        alert('name missing');
        $("#name").focus();
        return "";
    }
    if(cls==''){
        alert('class missing');
        $("#cls").focus();
        return "";
    }
    if(dob==''){
        alert('Birth Date missing');
        $("#dob").focus();
        return "";
    }
    if(address==''){
        alert('address missing');
        $("#address").focus();
        return "";
    }
    if(enrdate==''){
        alert('Enrollment Date missing');
        $("#enr-date").focus();
        return "";
    }
    
    var jsonStrObj ={
        rollno:rollno,
        name:name,
        class:cls,
        dob:dob,
        address:address,
        enrdate:enrdate,
    }
    return JSON.stringify(jsonStrObj);
}

function saveData() {
    var jsonStrObj = validateData();
    if(jsonStrObj==""){
        return "";
    }
    var putRequest=createPUTRequest(connToken,jsonStrObj,empDBName,empRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj= executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#rollno').focus();
}

function changeData() {
    $('#change').prop("disabled",true);
    jsonChg = validateData();
    var updateRequest= createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();
}

function getRollNoAsJsonObj() {
    var rollno= $("#rollno").val();
    var jsonStr={
        rollno:rollno
    };
    return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj) {
    var lvdata= JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvdata.rec_no);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#name').val(record.name);
    $('#cls').val(record.class);
    $('#dob').val(record.dob);
    $('#address').val(record.address);
    $('#enr-date').val(record.enrdate);
 
}


function getStd(){ 
    var empIdJsonObj =getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,empDBName,empRelationName,empIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status===400){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#name').focus();
    }
    else if (resJsonObj.status===200){
        $('#rollno').prop('disabled',true);
        fillData(resJsonObj);
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#name').focus();
    }
   
}