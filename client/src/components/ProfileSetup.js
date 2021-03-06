import React, { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow } from 'mdbreact';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import '../styles/profileSetup.css'
import { login, setSearchSkillArray } from '../redux/actions';
import SkillSearchBar from './SkillSearchBar';
import Axios from 'axios';
import Footer from './Footer'
import Navbar from '../components/Navbar'
import ScrollToTop from './ScrollToTop';




export default function ProfileSetup() {
  const user = useSelector(state => state.user)
  const [headline, setHeadline] = useState(user.loginInfo.title || '');
  const dispatch = useDispatch();
  const history = useHistory();
  const [profilePicture, setProfilePicture] = useState('')
  const formData = new FormData()
  const pickedSkillsArray = useSelector(state => state.searchSkillsToAdd)
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    dispatch(setSearchSkillArray(user.loginInfo.Skills))
  }, [dispatch, user.loginInfo.Skills])

  const handlePhoto = (e) => {
    e.preventDefault();
    formData.append('profilePicture',profilePicture)
    
    fetch('/api/v1/hub', {
      method: 'PATCH',
      body:formData
    })
      .then(res => res.json())
      .then(data => {
        if(!data.error){
          loadProject()
          alert('Yay! Profile picture updated.')
          handleClose()
        }else{
          alert('Error loading picture')
        }
      })
    
  }
  const loadProject = () => {
    fetch('/api/v1/hub/current')
      .then(res => res.json())
      .then(data => {
        dispatch(login(data))

      })
  }
  const toggle = () => {
    setModal(!modal);
  }

  const deleteAccount = () => {
    fetch(`/api/v1/hub/${user.loginInfo.id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(res => {
        let path = "/"
        history.push(path)
      })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setHeadline('');
    const userSkillsArray = pickedSkillsArray.map(skill => skill.id)
    Axios.patch('/api/v1/hub', {
      title: headline,
      userSkillsArray
    })
      .then(res => {
        history.push("/dashboard")
      })
      .catch(e => {
        console.log(e)
      })
  }


  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div id="top">
        <MDBContainer>
          <MDBRow>
            <MDBCol md='3' className="mt-5">
              <MDBCard testimonial className="card-profile" >
                <div />
                <div className='image-and-camera'>
                  <img
                    src={user.loginInfo.profilePicture}
                    alt='' className="rounded-circle hoverable border border-info profile-setup"
                  />
                  <button className="camera-button" onClick={handleShow}>
                    <MDBIcon icon="camera" />
                  </button>
                </div>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title> Update your profile picture</Modal.Title>
                  </Modal.Header>
                  <Modal.Body><form className="form-update-pic" id="profilePic" onSubmit={(e) => { handlePhoto(e) }}>

                    <div className="input-block-update">
                      <label htmlFor="newProfilePic" >  Choose file
           </label>
                      <br />

                      <label htmlFor="newProfilePic" className="new-profile-pic">
                        <MDBIcon far icon="plus-square indigo-text" size='2x' />
                      </label> {profilePicture ? profilePicture.name : ''}


                      <input type="file" id="newProfilePic" className="form-control" onChange={(e) => { setProfilePicture(e.target.files[0]) }} />

                    </div>
                  </form>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                      Close
          </Button>
                    <Button form="profilePic" variant="success" type="submit" className=" ">
                      SAVE CHANGES
          </Button>

                  </Modal.Footer>
                </Modal>

                <MDBCardBody>
                  <h4 className='card-title'> <MDBIcon icon="user indigo-text" /> {user.loginInfo.firstName} {user.loginInfo.lastName} </h4>
                  <h4 className='card-title'> <MDBIcon icon="envelope orange-text" /> {user.loginInfo.email} </h4>
                  <hr />

                  <Button onClick={toggle} className="btn btn-danger ">
                    DELETE ACCOUNT
          </Button>
                  <MDBModal isOpen={modal} toggle={toggle}>
                    <MDBModalHeader toggle={toggle}><i className="fas fa-exclamation-triangle amber-text"></i> WARNING <i className="fas fa-exclamation-triangle amber-text"></i></MDBModalHeader>
                    <MDBModalBody>
                      <h4>Are you sure you want to delete your account?</h4>
                      <h6>Deleting your account is permanent and will remove all content including comments, avatars and profile settings.</h6>
                    </MDBModalBody>
                    <MDBModalFooter>
                      <button className='btn btn-dark' onClick={deleteAccount} form="edit">Yes</button>
                      <button className='btn btn-primary' onClick={toggle}>No</button>
                    </MDBModalFooter>
                  </MDBModal>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>


            <MDBCol md="9" className=" container-form ">
              <MDBCard className="card-complete-profile " testimonial>
                <div className="form-title ml-5">
                  COMPLETE <br/>YOUR PROFILE <MDBIcon icon="edit indigo-text" />
                </div>
                <div >
                  <form onSubmit={(e) => { handleSubmit(e) }}>
                    <label htmlFor="defaultFormCardNameEx" className="labe-headline"><MDBIcon icon="share indigo-text" />  Headline
           </label>

                    <input type="text" id="defaultFormCardNameEx" className="form-control" value={headline} onChange={(e) => { setHeadline(e.target.value) }} />
                    <br />

                    <h1 className=" label-skillbar"><MDBIcon icon="share indigo-text" /> Technical Skills</h1>
                    <SkillSearchBar category='technical' />
                    <br />

                    <h1 className=" label-skillbar"><MDBIcon icon="share indigo-text" /> Soft Skills</h1>
                    <SkillSearchBar category='soft' />
                    <br />

                    <h1 className=" label-skillbar"> <MDBIcon icon="share indigo-text" /> Spoken Languages</h1>
                    <SkillSearchBar category='language' /><br />

                    <Button variant="success" type="submit" className="btn btn-lg btn-block mb-5">
                      SUBMIT <MDBIcon far icon="paper-plane" />
                    </Button>
                  </form>
                </div>

              </MDBCard>
            </MDBCol>

          </MDBRow>
        </MDBContainer>
      </div>

      <Footer />
    </>
  )
}
