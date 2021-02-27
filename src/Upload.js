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
            success:null,
      }

    this.handleChange= this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    
    }

    // handle editing
    handleChange(event){
        const target = event.target;
        const value=target.value;
        const name=target.name;
        this.setState({[name]:value});
    }

    async getFiles(files){
        this.setState({
            success:null,
            isLoading : "Extracting data",
            files : files
    });
    console.log(files);


    const UID= Math.round(1+ Math.random() * (1000000-1));

    var date={
        fileExt:"png",
        imageID: UID,
        folder:UID,
        img : this.state.files[0].base64
    };

    
    this.setState({confirmation : "Processing..."})
    await fetch(
        'https://bje59v8af5.execute-api.ap-northeast-2.amazonaws.com/Production', // upload image to s3
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
        'https://bje59v8af5.execute-api.ap-northeast-2.amazonaws.com/Production/ocr', // extract data using ocr
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

    // submit form data to database
    async handleSubmit(event){
        this.setState({confirmation : "Uploading..."});
        const formData={
            name:this.state.your_name,
            fatherName:this.state.father_name,
            dateOfBirth:this.state.date_of_birth,
            panNumber:this.state.pan_number
        }
        await fetch(
            'https://bje59v8af5.execute-api.ap-northeast-2.amazonaws.com/Production/submit',
            {
            method:"POST",
            headers:{
                Accept: "application/json",
                "Content-Type":"application.json"
            },
            body: JSON.stringify(formData)
        })
        .then((res)=>{
            console.log(res.json());
            if(res.status===200){
                this.setState({
                    success:true,
                    files:"",
                    your_name:"",
                    father_name:"",
                    date_of_birth:"",
                    pan_number:"",
                    confirmation:""
                })
            }
        })
    }

    render() { 
        const processing=this.state.confirmation;
        return (
             
           <div className="row">
               
               <div className="col-6 offset-3">

                   {/* display success msg */}
                    {this.state.success && (
                        <Alert color="success">
                        <h1>Form submitted successfully</h1>
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
                                name="your_name"
                                id="name"
                                required
                                value={this.state.your_name}
                                onChange={this.handleChange}
                            />

                        </FormGroup>


                        <FormGroup>
                            <Label>
                                <h6>Father's Name</h6>
                            </Label>
                            <Input 
                                type="text"
                                name="father_name"
                                id="fname"
                                required
                                value={this.state.father_name}
                                onChange={this.handleChange}
                            />
                        </FormGroup>



                        <FormGroup>
                            <Label>
                                <h6>Date of Birth</h6>
                            </Label>
                            <Input 
                                type="text"
                                name="date_of_birth"
                                id="dob"
                                required
                                value={this.state.date_of_birth}
                                onChange={this.handleChange}
                            />
                        </FormGroup>


                        <FormGroup>
                            <Label>
                                <h6>Permanent Account Number(PAN)</h6>
                            </Label>
                            <Input 
                                type="text"
                                name="pan_number"
                                id="pan"
                                required
                                value={this.state.pan_number}
                                onChange={this.handleChange}
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