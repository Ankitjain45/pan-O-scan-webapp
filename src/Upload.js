import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';
import {Button,Form,FormGroup,Label,FormText,Input,Alert} from "reactstrap";

import "./upload.css";


class Upload extends Component {

    constructor(props){
        super(props);

    
    this.state = {
            confirmation : "",
            isLoading : "",
            files : "",
            your_name: "",
            father_name: "",
            date_of_birth: "",
            pan_number: "",
            Error: null,
            warnings: null,
            msg:null,
      }

    this.handleChane= this.handleChane.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    
    }


    handleChane(event){
        event.preventDefault();
        const target = event.target;
        const value=target.value;
        const name=target.name;

        this.setState({name:value});

    }

    async handleSubmit(event){
        event.preventDefault();
        // this.setState({confirmation : "Uploading..."});
        // const formData={
        //     name:this.state.your_name,
        //     fatherName:this.state.father_name,
        //     dateOfBirth:this.date_of_birth,
        //     panNumber:this.state.pan_number
        // }
        // await fetch('',{
        //     method:"POST",
        //     headers:{
        //         Accept: "application/json",
        //         "Content-Type":"application.json"
        //     },
        //     body: JSON.stringify(formData)
        // })
        // .then((res)=>{
        //     if(res.statusCode===200){
        //         this.setState({
        //             msg:res.message,
        //             your_name:"",
        //             father_name:"",
        //             date_of_birth:"",
        //             pan_number:"",
        //             confirmation:""
        //         })
        //     }
        // })
        this.setState({
            your_name:"",
            father_name:"",
            date_of_birth:"",
            pan_number:"",
            confirmation:""
        })
    }

    async getFiles(files){
        this.setState({
            msg:null,
            isLoading : "Extracting data",
            files : files
    });


    const UID= Math.round(1+ Math.random() * (1000000-1));

    var date={
        fileExt:"png",
        imageID: UID,
        folder:UID,
        img : this.state.files[0].base64
    };

    this.setState({confirmation : "Processing..."})
    await fetch(
        'https://bje59v8af5.execute-api.ap-northeast-2.amazonaws.com/Production',
        {
        method: "POST",
        headers: {
            Accept : "application/json",
            "Content-Type": "application.json"
        },
        body : JSON.stringify(date)
        }
    );



    let targetImage= UID + ".png";
    const response=await fetch(
        'https://bje59v8af5.execute-api.ap-northeast-2.amazonaws.com/Production/ocr',
        {
        method: "POST",
        headers: {
            Accept : "application/json",
            "Content-Type": "application.json"
        },
        body : JSON.stringify(targetImage)
        }
       
    );
    this.setState({confirmation : ""})

    const OCRBody = await response.json();
    console.log("OCRBody",OCRBody);
    this.setState({
        Error:OCRBody.error,
    })
    this.setState({
        your_name :OCRBody.body[0],
        father_name :OCRBody.body[1],
        date_of_birth: OCRBody.body[2],
        pan_number: OCRBody.body[3],
        warnings:OCRBody.warnings,
    })
    }
    submitForm(){
        
    }

    render() { 
        const processing=this.state.confirmation;
        return (
             
           <div className="row">
               
               <div className="col-6 offset-3">

                   {/* display success msg */}
                    {this.state.msg && (
                        <Alert color="success">
                        <h1>{this.state.msg}</h1>
                        </Alert>
                    )}

                    <Form onSubmit={this.handleSubmit} >
                        <FormGroup>
                           <h3 className="text-danger">{processing}</h3>    
                           <h6>UPLOAD PAN CARD</h6>
                           <FormText color="muted">PNG,JPG</FormText>
                       
                       
                        <div className="form-group files color">
                            <FileBase64 
                            multiple={true} 
                            onDone={this.getFiles.bind(this)}></FileBase64>

                        </div>
                        </FormGroup> 

                        {/* display error (if any) */}
                        {this.state.Error && (
                            <Alert color="danger">
                            <h1>{this.state.Error}</h1>
                            </Alert>
                        )}
                        {/* disply warnings (if any) */}
                        {this.state.warnings && (
                            <Alert color="warning">
                            <h1>{this.state.warnings}</h1>
                            </Alert>
                        )}

                        {/* render form */}
                        <FormGroup>
                            <Label>
                                <h6>Name</h6>
                            </Label>
                            <Input 
                                type="text"
                                name="Name"
                                id="name"
                                required
                                value={this.state.your_name}
                                onChange={this.handleChane}
                            />

                        </FormGroup>


                        <FormGroup>
                            <Label>
                                <h6>Father's Name</h6>
                            </Label>
                            <Input 
                                type="text"
                                name="Father's Name"
                                id="father_name"
                                required
                                value={this.state.father_name}
                                onChange={this.handleChane}
                            />
                        </FormGroup>



                        <FormGroup>
                            <Label>
                                <h6>Date of Birth</h6>
                            </Label>
                            <Input 
                                type="text"
                                name="Date of Birth"
                                id="date_of_birth"
                                required
                                value={this.state.date_of_birth}
                                onChange={this.handleChane}
                            />
                        </FormGroup>


                        <FormGroup>
                            <Label>
                                <h6>Permanent Account Number(PAN)</h6>
                            </Label>
                            <Input 
                                type="text"
                                name="Permanent Account Number"
                                id="pan"
                                required
                                value={this.state.pan_number}
                                onChange={this.handleChane}
                            />
                        </FormGroup>

                        <Button className="btn btn-lg btn-block  btn-success">
                            Submit
                        </Button>
                    </Form>   
                </div>  
           </div>
         );
    }
}
 
export default Upload;