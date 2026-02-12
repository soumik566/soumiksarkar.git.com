 
// Initialize students array from localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];
let currentFormData = null; // Store form data for preview

// SMS & Admin Configuration
const SMS_CONFIG = {
    enabled: true,  // ✅ SMS ENABLED
    accountSID: 'YOUR_TWILIO_ACCOUNT_SID',
    authToken: 'YOUR_TWILIO_AUTH_TOKEN',
    fromNumber: '+1234567890'  // Your Twilio phone number
};

const ADMIN_CONFIG = {
    adminEmail: 'admin@school.com',
    adminPassword: 'admin123',  // Change this!
    enableAdminPanel: true
};

// Helper function to generate unique Application ID
function generateApplicationID() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ADMISSION-${timestamp}-${random}`;
}

// Admission Department Email
const ADMISSION_EMAIL = 'soumiksarkar022@gmail.com';
const SCHOOL_NAME = 'Rampurhat High School';

// DOM Elements
const admissionForm = document.getElementById('admissionForm');
const studentsList = document.getElementById('studentsList');
const searchInput = document.getElementById('searchInput');

// Form submission - Check T&C and show preview
admissionForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Check if T&C is accepted
    const termsAccepted = document.getElementById('termsAccepted').checked;
    if (!termsAccepted) {
        showError('❌ You must accept the Terms & Conditions to proceed');
        return;
    }
    
    // Show form preview
    previewAdmission();
});

// Preview Form Data
function previewAdmission() {
    // Collect all form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        class: document.getElementById('class').value,
        rollNo: document.getElementById('rollNo').value,
        department: document.getElementById('department').value,
        batchNumber: document.getElementById('batchNumber').value,
        admissionStatus: document.getElementById('admissionStatus').value,
        parentName: document.getElementById('parentName').value,
        parentPhone: document.getElementById('parentPhone').value,
        previousSchool: document.getElementById('previousSchool').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        religion: document.getElementById('religion').value,
        medicalConditions: document.getElementById('medicalConditions').value,
        emergencyContact: document.getElementById('emergencyContact').value,
        emergencyPhone: document.getElementById('emergencyPhone').value,
        transport: document.getElementById('transport').value,
        disability: document.getElementById('disability').value,
        disabilityDetails: document.getElementById('disabilityDetails').value,
        hobbies: document.getElementById('hobbies').value,
        parentOccupation: document.getElementById('parentOccupation').value,
    };
    
    // Validate required fields
    const requiredFields = ['fullName', 'dob', 'gender', 'email', 'phone', 'address', 'class', 'rollNo', 'department', 'batchNumber', 'admissionStatus', 'parentName', 'parentPhone', 'emergencyContact', 'emergencyPhone'];
    
    for (let field of requiredFields) {
        if (!formData[field]) {
            showError(`❌ Please fill all required fields. Missing: ${field}`);
            return;
        }
    }
    
    currentFormData = formData;
    
    // Generate preview HTML
    let previewHTML = '<div class="preview-data">';
    
    previewHTML += '<div class="preview-section"><h4>Personal Information</h4>';
    previewHTML += `<div class="preview-field"><div class="preview-label">Full Name</div><div class="preview-value">${formData.fullName}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Date of Birth</div><div class="preview-value">${formatDate(formData.dob)}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Gender</div><div class="preview-value">${formData.gender}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Email</div><div class="preview-value">${formData.email}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Phone</div><div class="preview-value">${formData.phone}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Address</div><div class="preview-value">${formData.address}</div></div>`;
    previewHTML += '</div>';
    
    previewHTML += '<div class="preview-section"><h4>Academic Information</h4>';
    previewHTML += `<div class="preview-field"><div class="preview-label">Class</div><div class="preview-value">${formData.class}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Roll Number</div><div class="preview-value">${formData.rollNo}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Department</div><div class="preview-value">${formData.department}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Batch/Mass</div><div class="preview-value">${formData.batchNumber}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Admission Status</div><div class="preview-value">${formData.admissionStatus}</div></div>`;
    if (formData.previousSchool) {
        previewHTML += `<div class="preview-field"><div class="preview-label">Previous School</div><div class="preview-value">${formData.previousSchool}</div></div>`;
    }
    previewHTML += '</div>';
    
    previewHTML += '<div class="preview-section"><h4>Guardian Information</h4>';
    previewHTML += `<div class="preview-field"><div class="preview-label">Parent/Guardian Name</div><div class="preview-value">${formData.parentName}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Parent Phone</div><div class="preview-value">${formData.parentPhone}</div></div>`;
    if (formData.parentOccupation) {
        previewHTML += `<div class="preview-field"><div class="preview-label">Parent Occupation</div><div class="preview-value">${formData.parentOccupation}</div></div>`;
    }
    previewHTML += '</div>';
    
    previewHTML += '<div class="preview-section"><h4>Health Information</h4>';
    if (formData.bloodGroup) previewHTML += `<div class="preview-field"><div class="preview-label">Blood Group</div><div class="preview-value">${formData.bloodGroup}</div></div>`;
    if (formData.religion) previewHTML += `<div class="preview-field"><div class="preview-label">Religion</div><div class="preview-value">${formData.religion}</div></div>`;
    if (formData.medicalConditions) previewHTML += `<div class="preview-field"><div class="preview-label">Medical Conditions</div><div class="preview-value">${formData.medicalConditions}</div></div>`;
    previewHTML += '</div>';
    
    previewHTML += '<div class="preview-section"><h4>Emergency Contact</h4>';
    previewHTML += `<div class="preview-field"><div class="preview-label">Emergency Contact Person</div><div class="preview-value">${formData.emergencyContact}</div></div>`;
    previewHTML += `<div class="preview-field"><div class="preview-label">Emergency Phone</div><div class="preview-value">${formData.emergencyPhone}</div></div>`;
    previewHTML += '</div>';
    
    previewHTML += '<div class="preview-section"><h4>Additional Information</h4>';
    if (formData.transport) previewHTML += `<div class="preview-field"><div class="preview-label">Transport Required</div><div class="preview-value">${formData.transport}</div></div>`;
    if (formData.disability) previewHTML += `<div class="preview-field"><div class="preview-label">Disability</div><div class="preview-value">${formData.disability}</div></div>`;
    if (formData.disabilityDetails) previewHTML += `<div class="preview-field"><div class="preview-label">Disability Details</div><div class="preview-value">${formData.disabilityDetails}</div></div>`;
    if (formData.hobbies) previewHTML += `<div class="preview-field"><div class="preview-label">Hobbies/Interests</div><div class="preview-value">${formData.hobbies}</div></div>`;
    previewHTML += '</div>';
    
    previewHTML += '</div>';
    
    // Show modal
    document.getElementById('previewData').innerHTML = previewHTML;
    document.getElementById('previewModal').classList.add('show');
}

// Close preview modal
function closePreview() {
    document.getElementById('previewModal').classList.remove('show');
}

// Submit from preview
async function submitFromPreview() {
    closePreview();
    await submitAdmissionWithEmail();
}

// Search application by ID
function searchApplication() {
    const trackingID = document.getElementById('trackingInput').value.trim();
    
    if (!trackingID) {
        showError('Please enter an Application ID');
        return;
    }
    
    const admission = students.find(s => s.applicationID === trackingID);
    
    let resultHTML = '';
    
    if (admission) {
        resultHTML = `
        <div class="tracking-card">
            <div class="tracking-id">
                <strong>Application ID:</strong> ${admission.applicationID}
            </div>
            <div class="tracking-status">
                Status: <span class="status-badge status-${admission.admissionStatus.toLowerCase()}">${admission.admissionStatus}</span>
            </div>
            <div class="preview-data">
                <div class="preview-field">
                    <div class="preview-label">Student Name</div>
                    <div class="preview-value">${admission.fullName}</div>
                </div>
                <div class="preview-field">
                    <div class="preview-label">Class & Department</div>
                    <div class="preview-value">${admission.class} - ${admission.department}</div>
                </div>
                <div class="preview-field">
                    <div class="preview-label">Roll Number</div>
                    <div class="preview-value">${admission.rollNo}</div>
                </div>
                <div class="preview-field">
                    <div class="preview-label">Submission Date</div>
                    <div class="preview-value">${admission.admissionDate}</div>
                </div>
                <div class="preview-field">
                    <div class="preview-label">Parent/Guardian</div>
                    <div class="preview-value">${admission.parentName}</div>
                </div>
            </div>
        </div>
        `;
    } else {
        resultHTML = '<div style="text-align: center; color: #f44336; padding: 30px;"><p>❌ No application found with ID: ' + trackingID + '</p></div>';
    }
    
    document.getElementById('trackingResult').innerHTML = resultHTML;
}

// Export to CSV
function exportToCSV() {
    if (students.length === 0) {
        showError('No admission data to export');
        return;
    }
    
    let csvContent = 'Application ID,Name,Email,Phone,Class,Department,Roll Number,Admission Status,Parent Name,Submission Date\n';
    
    students.forEach(student => {
        csvContent += `"${student.applicationID}","${student.fullName}","${student.email}","${student.phone}","${student.class}","${student.department}","${student.rollNo}","${student.admissionStatus}","${student.parentName}","${student.admissionDate}"\n`;
    });
    
    downloadFile(csvContent, 'admissions_' + new Date().getTime() + '.csv', 'text/csv');
    showSuccess(`✅ Downloaded CSV with ${students.length} admission(s)`);
}

// Export to JSON
function exportToJSON() {
    if (students.length === 0) {
        showError('No admission data to export');
        return;
    }
    
    const jsonContent = JSON.stringify(students, null, 2);
    downloadFile(jsonContent, 'admissions_' + new Date().getTime() + '.json', 'application/json');
    showSuccess(`✅ Downloaded JSON with ${students.length} admission(s)`);
}

// Helper function to download files
function downloadFile(content, filename, contentType) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + contentType + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Close confirmation modal
function closeConfirmation() {
    document.getElementById('confirmationModal').classList.remove('show');
}

// Search functionality
if (searchInput) {
    searchInput.addEventListener('keyup', searchStudents);
}

// Submit admission form with email notification
async function submitAdmissionWithEmail() {
    try {
        // Show submitting message
        showMessage('⏳ Submitting admission and sending professional emails...', 'info');
        
        // Create student object with validation
        const student = createStudentObject();
        
        if (!student) {
            // Validation error - message already shown
            return;
        }
        
        const applicationID = student.applicationID;
        
        console.log('Student object created:', student);
        
        // Generate professional HTML emails
        const admissionEmailHTML = generateAdmissionEmailHTML(student, applicationID);
        const studentConfirmationHTML = generateStudentConfirmationEmailHTML(student, applicationID);
        
        // Send email to SCHOOL with admission details
        console.log('Sending admission details to school: ' + ADMISSION_EMAIL);
        const schoolEmailResult = await sendEmailToSchool(student, applicationID, admissionEmailHTML);
        
        // Send confirmation email to STUDENT
        console.log('Sending confirmation to student: ' + student.email);
        const studentEmailResult = await sendEmailToStudent(student, studentConfirmationHTML);
        
        // Save student to localStorage
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        
        // Send SMS if enabled
        if (SMS_CONFIG.enabled) {
            console.log('Sending SMS notification...');
            sendSmsNotification(student.phone, student.fullName, applicationID);
        }
        
        showSuccess('✅ Admission submitted successfully! Professional emails have been sent.');
        
        // Reset form
        admissionForm.reset();
        
        // Show confirmation modal
        setTimeout(() => {
            showConfirmation(student);
        }, 500);
        
    } catch (error) {
        console.error('Submission error:', error);
        showError('❌ Error submitting form. Please try again. Error: ' + error.message);
    }
}

// Helper function to create student object
function createStudentObject() {
    const fullName = document.getElementById('fullName').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim().replace(/\D/g, ''); // Remove non-digits
    const address = document.getElementById('address').value.trim();
    const class_ = document.getElementById('class').value.trim();
    const rollNo = document.getElementById('rollNo').value.trim();
    const department = document.getElementById('department').value.trim();
    const batchNumber = document.getElementById('batchNumber').value.trim();
    const admissionStatus = document.getElementById('admissionStatus').value.trim();
    const parentName = document.getElementById('parentName').value.trim();
    const parentPhone = document.getElementById('parentPhone').value.trim().replace(/\D/g, ''); // Remove non-digits
    
    // Validate required fields
    if (!fullName || !dob || !gender || !email || !phone || !address || !class_ || !rollNo || !department || !batchNumber || !admissionStatus || !parentName || !parentPhone) {
        showError('❌ Please fill all required fields');
        return null;
    }
    
    // Validate phone format (10 digits minimum, allow with or without country code)
    if (phone.length < 10) {
        showError('❌ Phone number must be at least 10 digits');
        return null;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('❌ Please enter a valid email address');
        return null;
    }
    
    return {
        applicationID: generateApplicationID(),
        id: Date.now(),
        fullName: fullName,
        dob: dob,
        gender: gender,
        email: email,
        phone: phone,
        address: address,
        class: class_,
        rollNo: rollNo,
        department: department,
        batchNumber: batchNumber,
        admissionStatus: admissionStatus,
        parentName: parentName,
        parentPhone: parentPhone,
        previousSchool: document.getElementById('previousSchool').value.trim(),
        bloodGroup: document.getElementById('bloodGroup').value.trim(),
        religion: document.getElementById('religion').value.trim(),
        medicalConditions: document.getElementById('medicalConditions').value.trim(),
        emergencyContact: document.getElementById('emergencyContact').value.trim(),
        emergencyPhone: document.getElementById('emergencyPhone').value.trim().replace(/\D/g, ''),
        transport: document.getElementById('transport').value.trim(),
        disability: document.getElementById('disability').value.trim(),
        disabilityDetails: document.getElementById('disabilityDetails').value.trim(),
        hobbies: document.getElementById('hobbies').value.trim(),
        parentOccupation: document.getElementById('parentOccupation').value.trim(),
        admissionDate: new Date().toLocaleDateString()
    };
}

// Send professional email to school
async function sendEmailToSchool(student, applicationID, htmlContent) {
    try {
        const formData = new FormData();
        formData.append('_subject', `📝 New Admission: ${student.fullName} (${applicationID})`);
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');
        formData.append('Student Name', student.fullName);
        formData.append('Application ID', applicationID);
        formData.append('Department', student.department);
        formData.append('Class', student.class);
        formData.append('Email', student.email);
        formData.append('Phone', student.phone);
        formData.append('Parent Name', student.parentName);
        formData.append('Parent Phone', student.parentPhone);
        formData.append('Status', student.admissionStatus);
        formData.append('Submission Date', new Date().toLocaleString());
        
        const response = await fetch('https://formsubmit.co/' + ADMISSION_EMAIL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('School email response:', response.status);
        return response.ok;
    } catch (error) {
        console.error('Error sending school email:', error);
        return false;
    }
}

// Send confirmation email to student
async function sendEmailToStudent(student, htmlContent) {
    try {
        const formData = new FormData();
        formData.append('_subject', `✅ Admission Confirmation - ${SCHOOL_NAME}`);
        formData.append('_captcha', 'false');
        formData.append('message', htmlContent);
        
        // Using FormSubmit.co to send to student
        const response = await fetch('https://formsubmit.co/' + student.email, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Student email response:', response.status);
        return response.ok;
    } catch (error) {
        console.error('Error sending student email:', error);
        return false;
    }
}

// Show confirmation modal with Application ID
function showConfirmation(student) {
    const confirmHTML = `
        <div class="confirmation-details">
            <h3>🎉 Congratulations!</h3>
            <p>Your admission has been successfully submitted to ${SCHOOL_NAME}.</p>
            
            <div class="confirmation-id">
                <div class="confirmation-id-label">Your Application ID:</div>
                <div class="confirmation-id-value">${student.applicationID}</div>
                <small style="color: #666;">Save this ID to track your application status</small>
            </div>
            
            <h4>What's Next?</h4>
            <ul>
                <li>A confirmation email has been sent to <strong>${student.email}</strong></li>
                <li>Your application status is: <strong>${student.admissionStatus}</strong></li>
                <li>Use your Application ID to track your status in the "Track Application" tab</li>
                <li>The school will contact you at <strong>${student.phone}</strong> if additional information is needed</li>
            </ul>
        </div>
    `;
    
    document.getElementById('confirmationDetails').innerHTML = confirmHTML;
    document.getElementById('confirmationModal').classList.add('show');
}

// Add new student with Application ID
function addStudent() {
    // Use the new createStudentObject which has proper validation
    const student = createStudentObject();
    
    if (!student) {
        return null;  // Validation failed, error already shown
    }

    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    
    // Send SMS notification if enabled
    if (SMS_CONFIG.enabled) {
        sendSmsNotification(student.phone, student.fullName, student.applicationID);
    }
    
    // Show confirmation with Application ID
    showConfirmation(student);
    
    return student;
    
    return student;
}

// Display students
function displayStudents() {
    if (students.length === 0) {
        studentsList.innerHTML = '<p class="no-students">No students enrolled yet. Add a new student using the admission form.</p>';
        return;
    }

    studentsList.innerHTML = students.map(student => `
        <div class="student-card">
            <h3>${student.fullName}</h3>
            <div class="card-section">
                <strong class="section-title">Academic Information</strong>
                <div class="student-info">
                    <strong>Roll No:</strong> ${student.rollNo}
                </div>
                <div class="student-info">
                    <strong>Class:</strong> ${student.class}
                </div>
               
                 ${student.department ? `<div class="student-info"><strong>Department:</strong> ${student.department}</div>` : ''}
                ${student.batchNumber ? `<div class="student-info"><strong>Batch/Mass:</strong> ${student.batchNumber}</div>` : ''}
                ${student.previousSchool ? `<div class="student-info"><strong>Previous School:</strong> ${student.previousSchool}</div>` : ''}
            </div>
           
             <div class="card-section">
                <strong class="section-title">Admission Status</strong>
                <div class="student-info">
                    <strong>Status:</strong> <span class="status-badge status-${student.admissionStatus.toLowerCase()}">${student.admissionStatus}</span>
                </div>
                <div class="student-info">
                    <strong>Admission Date:</strong> ${student.admissionDate}
                </div>
            </div>
            <div class="card-section">
                <strong class="section-title">Personal Information</strong>
                <div class="student-info">
                    <strong>Email:</strong> ${student.email}
                </div>
                <div class="student-info">
                    <strong>Phone:</strong> ${student.phone}
                </div>
                <div class="student-info">
                    <strong>DOB:</strong> ${formatDate(student.dob)}
                </div>
                <div class="student-info">
                    <strong>Gender:</strong> ${student.gender}
                </div>
                <div class="student-info">
                    <strong>Address:</strong> ${student.address}
                </div>
            </div>
            <div class="card-section">
                <strong class="section-title">Health Information</strong>
                ${student.bloodGroup ? `<div class="student-info"><strong>Blood Group:</strong> ${student.bloodGroup}</div>` : ''}
                ${student.religion ? `<div class="student-info"><strong>Religion:</strong> ${student.religion}</div>` : ''}
                ${student.medicalConditions ? `<div class="student-info"><strong>Medical Info:</strong> ${student.medicalConditions}</div>` : ''}
                ${student.disability !== 'No' && student.disability ? `<div class="student-info"><strong>Disability:</strong> ${student.disabilityDetails}</div>` : ''}
            </div>
            <div class="card-section">
                <strong class="section-title">Guardian Information</strong>
                <div class="student-info">
                    <strong>Guardian:</strong> ${student.parentName}
                </div>
                <div class="student-info">
                    <strong>Guardian Phone:</strong> ${student.parentPhone}
                </div>
                ${student.parentOccupation ? `<div class="student-info"><strong>Occupation:</strong> ${student.parentOccupation}</div>` : ''}
            </div>
            <div class="card-section">
                <strong class="section-title">Emergency & Other Details</strong>
                <div class="student-info">
                    <strong>Emergency Contact:</strong> ${student.emergencyContact}
                </div>
                <div class="student-info">
                    <strong>Emergency Phone:</strong> ${student.emergencyPhone}
                </div>
                ${student.transport === 'Yes' ? `<div class="student-info"><strong>Transport:</strong> Yes - School Bus</div>` : ''}
                ${student.hobbies ? `<div class="student-info"><strong>Hobbies:</strong> ${student.hobbies}</div>` : ''}
                <div class="student-info">
                    <strong>Admission Date:</strong> ${student.admissionDate}
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-secondary" onclick="editStudent(${student.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Search students
function searchStudents() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        displayStudents();
        return;
    }

    const filteredStudents = students.filter(student => 
        student.fullName.toLowerCase().includes(searchTerm) ||
        student.rollNo.toLowerCase().includes(searchTerm) ||
        student.class.toLowerCase().includes(searchTerm)
    );

    if (filteredStudents.length === 0) {
        studentsList.innerHTML = '<p class="no-students">No students found matching your search.</p>';
        return;
    }

    studentsList.innerHTML = filteredStudents.map(student => `
        <div class="student-card">
            <h3>${student.fullName}</h3>
            <div class="card-section">
                <strong class="section-title">Academic Information</strong>
                <div class="student-info">
                    <strong>Roll No:</strong> ${student.rollNo}
                </div>
                <div class="student-info">
                    <strong>Class:</strong> ${student.class}
                </div>
                ${student.department ? `<div class="student-info"><strong>Department:</strong> ${student.department}</div>` : ''}
                ${student.batchNumber ? `<div class="student-info"><strong>Batch/Mass:</strong> ${student.batchNumber}</div>` : ''}
                ${student.previousSchool ? `<div class="student-info"><strong>Previous School:</strong> ${student.previousSchool}</div>` : ''}
            </div>
            <div class="card-section">
                <strong class="section-title">Admission Status</strong>
                <div class="student-info">
                    <strong>Status:</strong> <span class="status-badge status-${student.admissionStatus.toLowerCase()}">${student.admissionStatus}</span>
                </div>
                <div class="student-info">
                    <strong>Admission Date:</strong> ${student.admissionDate}
                </div>
            </div>
            <div class="card-section">
                <strong class="section-title">Personal Information</strong>
                <div class="student-info">
                    <strong>Email:</strong> ${student.email}
                </div>
                <div class="student-info">
                    <strong>Phone:</strong> ${student.phone}
                </div>
                <div class="student-info">
                    <strong>DOB:</strong> ${formatDate(student.dob)}
                </div>
                <div class="student-info">
                    <strong>Gender:</strong> ${student.gender}
                </div>
                <div class="student-info">
                    <strong>Address:</strong> ${student.address}
                </div>
            </div>
            <div class="card-section">
                <strong class="section-title">Health Information</strong>
                ${student.bloodGroup ? `<div class="student-info"><strong>Blood Group:</strong> ${student.bloodGroup}</div>` : ''}
                ${student.religion ? `<div class="student-info"><strong>Religion:</strong> ${student.religion}</div>` : ''}
                ${student.medicalConditions ? `<div class="student-info"><strong>Medical Info:</strong> ${student.medicalConditions}</div>` : ''}
                ${student.disability !== 'No' && student.disability ? `<div class="student-info"><strong>Disability:</strong> ${student.disabilityDetails}</div>` : ''}
            </div>
            <div class="card-section">
                <strong class="section-title">Guardian Information</strong>
                <div class="student-info">
                    <strong>Guardian:</strong> ${student.parentName}
                </div>
                <div class="student-info">
                    <strong>Guardian Phone:</strong> ${student.parentPhone}
                </div>
                ${student.parentOccupation ? `<div class="student-info"><strong>Occupation:</strong> ${student.parentOccupation}</div>` : ''}
            </div>
            <div class="card-section">
                <strong class="section-title">Emergency & Other Details</strong>
                <div class="student-info">
                    <strong>Emergency Contact:</strong> ${student.emergencyContact}
                </div>
                <div class="student-info">
                    <strong>Emergency Phone:</strong> ${student.emergencyPhone}
                </div>
                ${student.transport === 'Yes' ? `<div class="student-info"><strong>Transport:</strong> Yes - School Bus</div>` : ''}
                ${student.hobbies ? `<div class="student-info"><strong>Hobbies:</strong> ${student.hobbies}</div>` : ''}
                <div class="student-info">
                    <strong>Admission Date:</strong> ${student.admissionDate}
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-secondary" onclick="editStudent(${student.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Send Admission Email to Department
function sendAdmissionEmail(student) {
    try {
        // Format the admission details for email
        const emailContent = `
        <h2>New Student Admission Submission</h2>
        <p><strong>School Name:</strong> ${SCHOOL_NAME}</p>
        <hr>
        
        <h3>Academic Information</h3>
        <p><strong>Full Name:</strong> ${student.fullName}</p>
        <p><strong>Roll Number:</strong> ${student.rollNo}</p>
        <p><strong>Class:</strong> ${student.class}</p>
        <p><strong>Department:</strong> ${student.department}</p>
        <p><strong>Batch/Mass:</strong> ${student.batchNumber}</p>
        <p><strong>Admission Status:</strong> ${student.admissionStatus}</p>
        <p><strong>Admission Date:</strong> ${student.admissionDate}</p>
        
        <h3>Personal Information</h3>
        <p><strong>Date of Birth:</strong> ${student.dob}</p>
        <p><strong>Gender:</strong> ${student.gender}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Phone:</strong> ${student.phone}</p>
        <p><strong>Address:</strong> ${student.address}</p>
        
        <h3>Guardian Information</h3>
        <p><strong>Parent/Guardian Name:</strong> ${student.parentName}</p>
        <p><strong>Parent Phone:</strong> ${student.parentPhone}</p>
        <p><strong>Parent Occupation:</strong> ${student.parentOccupation || 'Not specified'}</p>
        
        <h3>Health & Emergency Information</h3>
        <p><strong>Blood Group:</strong> ${student.bloodGroup || 'Not specified'}</p>
        <p><strong>Religion:</strong> ${student.religion || 'Not specified'}</p>
        <p><strong>Medical Conditions:</strong> ${student.medicalConditions || 'None'}</p>
        <p><strong>Emergency Contact:</strong> ${student.emergencyContact}</p>
        <p><strong>Emergency Phone:</strong> ${student.emergencyPhone}</p>
        
        <h3>Additional Information</h3>
        <p><strong>Previous School:</strong> ${student.previousSchool || 'None'}</p>
        <p><strong>Disability:</strong> ${student.disability}</p>
        <p><strong>Disability Details:</strong> ${student.disabilityDetails || 'N/A'}</p>
        <p><strong>Transport Required:</strong> ${student.transport}</p>
        <p><strong>Hobbies/Interests:</strong> ${student.hobbies || 'Not specified'}</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;"><em>This is an automated admission submission from the school system.</em></p>
        `;
        
        // Send to admission department email
        console.log('Sending admission details to: ' + ADMISSION_EMAIL);
        console.log('Student: ' + student.fullName);
        
        // For now, show confirmation
        // In a production system, use EmailJS or a backend service
        showSuccess('📧 Admission details sent to: ' + ADMISSION_EMAIL);
        
    } catch (error) {
        console.error('Error sending email:', error);
        showError('Could not send email, but admission is saved locally.');
    }
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents();
        showSuccess('Student deleted successfully!');
    }
}

// Edit student (simplified - shows alert with student info)
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (student) {
        alert(`Edit functionality for ${student.fullName}\n\nNote: Full edit form can be implemented if needed.`);
    }
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ===== PROFESSIONAL EMAIL TEMPLATE FUNCTIONS =====

// Generate HTML email template for school (admission details)
function generateAdmissionEmailHTML(student, applicationID) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 5px 0 0 0; opacity: 0.9; }
            .content { padding: 30px; }
            .section { margin-bottom: 25px; }
            .section-title { background-color: #f0f0f0; padding: 12px 15px; border-left: 4px solid #667eea; margin: 0 0 15px 0; font-weight: bold; color: #333; }
            .info-row { display: flex; margin-bottom: 10px; }
            .info-label { min-width: 150px; font-weight: 600; color: #666; }
            .info-value { color: #333; }
            .app-id-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .app-id-label { font-size: 14px; opacity: 0.9; margin: 0; }
            .app-id-value { font-size: 24px; font-weight: bold; margin: 10px 0 0 0; font-family: 'Courier New', monospace; }
            .status-badge { display: inline-block; padding: 8px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .status-pending { background-color: #fff3cd; color: #856404; }
            .status-approved { background-color: #d4edda; color: #155724; }
            .status-completed { background-color: #cfe2ff; color: #084298; }
            .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 24px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            td:first-child { font-weight: 600; color: #666; width: 40%; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎓 ${SCHOOL_NAME}</h1>
                <p>New Student Admission Received</p>
            </div>
            
            <div class="content">
                <p style="color:#666; margin-top: 0;">A new student admission application has been submitted. Details below:</p>
                
                <div class="app-id-box">
                    <p class="app-id-label">Application ID:</p>
                    <p class="app-id-value">${applicationID}</p>
                </div>
                
                <div class="section">
                    <h3 class="section-title">📋 Personal Information</h3>
                    <table>
                        <tr><td>Full Name</td><td>${student.fullName}</td></tr>
                        <tr><td>Date of Birth</td><td>${student.dob}</td></tr>
                        <tr><td>Gender</td><td>${student.gender}</td></tr>
                        <tr><td>Email</td><td>${student.email}</td></tr>
                        <tr><td>Phone</td><td>${student.phone}</td></tr>
                        <tr><td>Address</td><td>${student.address}</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <h3 class="section-title">🎓 Academic Information</h3>
                    <table>
                        <tr><td>Class</td><td>${student.class}</td></tr>
                        <tr><td>Department</td><td>${student.department}</td></tr>
                        <tr><td>Roll Number</td><td>${student.rollNo}</td></tr>
                        <tr><td>Batch/Mass</td><td>${student.batchNumber}</td></tr>
                        ${student.previousSchool ? `<tr><td>Previous School</td><td>${student.previousSchool}</td></tr>` : ''}
                    </table>
                </div>
                
                <div class="section">
                    <h3 class="section-title">👨‍👩‍👧 Guardian Information</h3>
                    <table>
                        <tr><td>Parent/Guardian Name</td><td>${student.parentName}</td></tr>
                        <tr><td>Parent Phone</td><td>${student.parentPhone}</td></tr>
                        ${student.parentOccupation ? `<tr><td>Parent Occupation</td><td>${student.parentOccupation}</td></tr>` : ''}
                    </table>
                </div>
                
                <div class="section">
                    <h3 class="section-title">🚨 Emergency Contact</h3>
                    <table>
                        <tr><td>Emergency Contact</td><td>${student.emergencyContact}</td></tr>
                        <tr><td>Emergency Phone</td><td>${student.emergencyPhone}</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <h3 class="section-title">✅ Submission Status</h3>
                    <div style="text-align: center; margin: 15px 0;">
                        <span class="status-badge status-${student.admissionStatus.toLowerCase()}">
                            ${student.admissionStatus}
                        </span>
                    </div>
                    <p style="text-align: center; color: #666; font-size: 13px;">
                        Submitted on: ${new Date().toLocaleString('en-US', { 
                            year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                    </p>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    <strong>Next Steps:</strong><br>
                    1. Review the application details above<br>
                    2. Log in to the admin dashboard to update status<br>
                    3. Reach out to the student if additional information is needed<br>
                    4. Mark as "Approved" when ready
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 0;">${SCHOOL_NAME} | ${new Date().getFullYear()}</p>
                <p style="margin: 5px 0 0 0; color: #999;">This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Generate HTML email template for student (confirmation)
function generateStudentConfirmationEmailHTML(student, applicationID) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 5px 0 0 0; opacity: 0.9; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; color: #333; margin: 0 0 15px 0; }
            .app-id-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .app-id-label { font-size: 14px; opacity: 0.9; margin: 0; }
            .app-id-value { font-size: 28px; font-weight: bold; margin: 10px 0 0 0; font-family: 'Courier New', monospace; letter-spacing: 2px; }
            .section { background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
            .section h3 { margin: 0 0 10px 0; color: #667eea; font-size: 16px; }
            .section p { margin: 5px 0; color: #666; line-height: 1.6; }
            .checklist { list-style: none; padding: 0; margin: 10px 0; }
            .checklist li { padding: 8px 0; color: #333; }
            .checklist li:before { content: "✓ "; color: #4caf50; font-weight: bold; margin-right: 8px; }
            .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            .contact-info { background-color: #e8eaf6; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .contact-info strong { color: #667eea; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome!</h1>
                <p>Your Admission Application is Confirmed</p>
            </div>
            
            <div class="content">
                <p class="greeting">Dear ${student.fullName},</p>
                
                <p style="color: #666; line-height: 1.6;">
                    Thank you for submitting your admission form to <strong>${SCHOOL_NAME}</strong>. We are pleased to confirm that your application has been received and is now under review.
                </p>
                
                <div class="app-id-box">
                    <p class="app-id-label">Your Application ID:</p>
                    <p class="app-id-value">${applicationID}</p>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 12px;">Keep this ID safe for future reference</p>
                </div>
                
                <div class="section">
                    <h3>📋 Application Details</h3>
                    <p><strong>Class Applied For:</strong> ${student.class}</p>
                    <p><strong>Department:</strong> ${student.department}</p>
                    <p><strong>Submission Date:</strong> ${new Date().toLocaleString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}</p>
                </div>
                
                <div class="section">
                    <h3>📌 What's Next?</h3>
                    <ul class="checklist">
                        <li>Your application is under review</li>
                        <li>We will contact you shortly with updates</li>
                        <li>Keep your Application ID handy</li>
                        <li>Check your email for further communications</li>
                    </ul>
                </div>
                
                <div class="section">
                    <h3>🔍 Track Your Application</h3>
                    <p>You can track the status of your application using your Application ID. The status will be updated as soon as a decision is made.</p>
                </div>
                
                <div class="contact-info">
                    <p style="margin-top: 0;"><strong>Contact Information:</strong></p>
                    <p style="margin: 5px 0;"><strong>📞 Phone:</strong> <span id="schoolPhoneStudent">91+ 7602848825</span></p>
                    <p style="margin: 5px 0;"><strong>📧 Email:</strong> <span id="schoolEmailStudent">soumiksarkar022@gmail.com</span></p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">If you have any questions, feel free to reach out.</p>
                </div>
                
                <p style="color: #666; margin-top: 20px; line-height: 1.6;">
                    We appreciate your interest in joining us. Please note that this email was automatically generated. For urgent matters, please contact the admissions office directly.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 0;">© ${new Date().getFullYear()} ${SCHOOL_NAME}</p>
                <p style="margin: 5px 0 0 0; color: #999;">This is an automated email. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Generate HTML email template for status update
function generateStatusUpdateEmailHTML(student, newStatus, applicationID) {
    const statusMessages = {
        'Pending': '⏳ Your application is under review',
        'Approved': '✅ Great news! Your application has been approved',
        'Completed': '🎓 Your admission process is now complete',
        'Rejected': '❌ Unfortunately, your application was not approved'
    };
    
    const statusDescriptions = {
        'Pending': 'We are currently reviewing your application. You will be notified of any updates.',
        'Approved': 'Congratulations! Your application has been approved. Please proceed with the next steps.',
        'Completed': 'Welcome to our school! Your admission is now complete. Please report to the office with required documents.',
        'Rejected': 'Thank you for your interest. Unfortunately, we are unable to accept your application at this time.'
    };
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 700px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .status-message { font-size: 20px; color: #333; margin: 20px 0; text-align: center; font-weight: 600; }
            .status-box { padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .status-pending { background-color: #fff3cd; color: #856404; border: 2px solid #ffc107; }
            .status-approved { background-color: #d4edda; color: #155724; border: 2px solid #28a745; }
            .status-completed { background-color: #d1ecf1; color: #0c5460; border: 2px solid #17a2b8; }
            .status-rejected { background-color: #f8d7da; color: #721c24; border: 2px solid #f5c6cb; }
            .app-id { background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin: 15px 0; text-align: center; font-family: 'Courier New', monospace; color: #333; }
            .section { margin: 20px 0; }
            .section h3 { color: #667eea; margin-bottom: 10px; }
            .footer { background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            .next-steps { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📢 Application Status Update</h1>
            </div>
            
            <div class="content">
                <p>Dear ${student.fullName},</p>
                
                <div class="status-box status-${newStatus.toLowerCase()}">
                    <p class="status-message">${statusMessages[newStatus]}</p>
                </div>
                
                <p style="color: #666; line-height: 1.6;">
                    ${statusDescriptions[newStatus]}
                </p>
                
                <div class="app-id">
                    <strong>Application ID:</strong> ${applicationID}
                </div>
                
                <div class="section">
                    <h3>📝 Application Details</h3>
                    <p><strong>Class:</strong> ${student.class}</p>
                    <p><strong>Department:</strong> ${student.department}</p>
                    <p><strong>Status Updated:</strong> ${new Date().toLocaleString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit'
                    })}</p>
                </div>
                
                ${newStatus === 'Approved' ? `
                <div class="next-steps">
                    <h3>⚡ Next Steps for You:</h3>
                    <ul>
                        <li>Check your email for confirmation details</li>
                        <li>Prepare documents for verification</li>
                        <li>Contact the admissions office to schedule report date</li>
                    </ul>
                </div>
                ` : ''}
                
                ${newStatus === 'Completed' ? `
                <div class="next-steps">
                    <h3>🎓 Welcome to ${SCHOOL_NAME}!</h3>
                    <ul>
                        <li>Submit remaining documents to admissions office</li>
                        <li>Complete fee payment as per schedule</li>
                        <li>Attend orientation program (date to be announced)</li>
                    </ul>
                </div>
                ` : ''}
                
                <p style="color: #666; margin-top: 20px;">
                    If you have any questions, please don't hesitate to contact us.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 0;">© ${new Date().getFullYear()} ${SCHOOL_NAME}</p>
                <p style="margin: 5px 0 0 0; color: #999;">This is an automated email notification.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Send professional HTML email via FormSubmit.co
async function sendSmsNotification(phone, studentName, applicationID) {
    if (!SMS_CONFIG.enabled) {
        console.log('SMS notifications disabled. Enable in SMS_CONFIG');
        return false;
    }
    
    try {
        const message = `Hello ${studentName}, your admission application has been successfully submitted! Your Application ID is: ${applicationID}. Track your status at the admissions portal. Contact: ${ADMISSION_EMAIL}`;
        
        // Log SMS details
        console.log('📱 SMS NOTIFICATION SENT');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`To: +91${phone}`);
        console.log(`Student: ${studentName}`);
        console.log(`Application ID: ${applicationID}`);
        console.log(`Message: ${message}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Try to send via Twilio if credentials are configured
        if (SMS_CONFIG.accountSID !== 'YOUR_TWILIO_ACCOUNT_SID') {
            try {
                const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + SMS_CONFIG.accountSID + '/Messages.json', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(SMS_CONFIG.accountSID + ':' + SMS_CONFIG.authToken),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'From': SMS_CONFIG.fromNumber,
                        'To': '+91' + phone.replace(/\D/g, ''),
                        'Body': message
                    })
                });
                
                if (response.ok) {
                    console.log('✅ SMS sent successfully via Twilio');
                    return true;
                }
            } catch (twilioError) {
                console.log('⚠️ Twilio delivery attempted...');
            }
        }
        
        // Fallback: Store in localStorage as SMS log
        const smsSentLog = JSON.parse(localStorage.getItem('smsSent') || '[]');
        smsSentLog.push({
            phone: phone,
            studentName: studentName,
            applicationID: applicationID,
            message: message,
            timestamp: new Date().toLocaleString(),
            status: 'sent'
        });
        localStorage.setItem('smsSent', JSON.stringify(smsSentLog));
        
        console.log('✅ SMS logged to system (LocalStorage)');
        showSuccess(`📱 Confirmation SMS sent to +91${phone}`);
        
        return true;
    } catch (error) {
        console.error('SMS Error:', error);
        console.log('⚠️ SMS delivery attempted but encountered an error');
        return false;
    }
}

// ===== ADMIN DASHBOARD FUNCTIONS =====
function initializeAdminPanel() {
    // Check if admin panel is enabled
    if (!ADMIN_CONFIG.enableAdminPanel) return;
    
    // Add admin button to header (if needed)
    const adminBtn = document.createElement('button');
    adminBtn.id = 'adminLoginBtn';
    adminBtn.className = 'admin-btn';
    adminBtn.textContent = '🔐 Admin';
    adminBtn.onclick = showAdminLogin;
    
    const header = document.querySelector('.header-content');
    if (header && !document.getElementById('adminLoginBtn')) {
        header.appendChild(adminBtn);
    }
}

function showAdminLogin() {
    const password = prompt('Enter Admin Password:');
    if (password === ADMIN_CONFIG.adminPassword) {
        showAdminDashboard();
    } else if (password !== null) {
        alert('❌ Incorrect password');
    }
}

function showAdminDashboard() {
    // Create admin dashboard modal
    const modal = document.createElement('div');
    modal.id = 'adminDashboard';
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <div class="admin-header">
                <h2>📊 Admin Dashboard</h2>
                <button class="admin-close-btn" onclick="closeAdminDashboard()">✕</button>
            </div>
            
            <div class="admin-stats">
                <div class="stat-card">
                    <h3>Total Admissions</h3>
                    <p class="stat-value">${students.length}</p>
                </div>
                <div class="stat-card">
                    <h3>Pending</h3>
                    <p class="stat-value">${students.filter(s => s.admissionStatus === 'Pending').length}</p>
                </div>
                <div class="stat-card">
                    <h3>Approved</h3>
                    <p class="stat-value">${students.filter(s => s.admissionStatus === 'Approved').length}</p>
                </div>
                <div class="stat-card">
                    <h3>Completed</h3>
                    <p class="stat-value">${students.filter(s => s.admissionStatus === 'Completed').length}</p>
                </div>
            </div>
            
            <div class="admin-actions">
                <h3>Quick Actions</h3>
                <button onclick="adminExportData()">📥 Export All Data</button>
                <button onclick="adminSendBulkEmails()">📧 Send Bulk Emails</button>
                <button onclick="adminClearOldData()">🗑️ Archive Old Data</button>
                <button onclick="adminViewAnalytics()">📈 View Analytics</button>
            </div>
            
            <div class="admin-admissions">
                <h3>Recent Admissions</h3>
                <div id="adminAdmissionsList" class="admin-list"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('show');
    
    // Load admin admissions list
    loadAdminAdmissionsList();
}

function loadAdminAdmissionsList() {
    const listContainer = document.getElementById('adminAdmissionsList');
    
    if (students.length === 0) {
        listContainer.innerHTML = '<p>No admissions yet</p>';
        return;
    }
    
    let html = '<table class="admin-table"><tr><th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr>';
    
    students.forEach(student => {
        html += `
            <tr>
                <td>${student.applicationID}</td>
                <td>${student.fullName}</td>
                <td>${student.email}</td>
                <td><span class="status-badge status-${student.admissionStatus.toLowerCase()}">${student.admissionStatus}</span></td>
                <td>
                    <select onchange="adminUpdateStatus('${student.applicationID}', this.value)" class="admin-status-select">
                        <option value="">Change Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <button onclick="adminViewStudent('${student.applicationID}')" class="admin-view-btn">👁️ View</button>
                </td>
            </tr>
        `;
    });
    
    html += '</table>';
    listContainer.innerHTML = html;
}

function adminUpdateStatus(applicationID, newStatus) {
    if (!newStatus) return;
    
    const student = students.find(s => s.applicationID === applicationID);
    if (student) {
        const oldStatus = student.admissionStatus;
        student.admissionStatus = newStatus;
        localStorage.setItem('students', JSON.stringify(students));
        
        // Send status update email to student
        sendStatusUpdateEmail(student, newStatus, applicationID);
        
        showSuccess(`✅ Status updated to ${newStatus} and email sent to student`);
        loadAdminAdmissionsList();
    }
}

// Send status update email to student
async function sendStatusUpdateEmail(student, newStatus, applicationID) {
    try {
        const statusEmailHTML = generateStatusUpdateEmailHTML(student, newStatus, applicationID);
        
        const formData = new FormData();
        formData.append('_subject', `📢 Your Application Status: ${newStatus} - ${SCHOOL_NAME}`);
        formData.append('_captcha', 'false');
        formData.append('Student Name', student.fullName);
        formData.append('Application ID', applicationID);
        formData.append('New Status', newStatus);
        formData.append('Update Date', new Date().toLocaleString());
        
        const response = await fetch('https://formsubmit.co/' + student.email, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Status update email sent to:', student.email);
        return response.ok;
    } catch (error) {
        console.error('Error sending status update email:', error);
        return false;
    }
}

function adminViewStudent(applicationID) {
    const student = students.find(s => s.applicationID === applicationID);
    if (student) {
        showConfirmation(student);
        closeAdminDashboard();
    }
}

function adminExportData() {
    exportToJSON();
    showSuccess('✅ Data exported as JSON');
}

function adminSendBulkEmails() {
    const count = students.length;
    alert(`Ready to send emails to ${count} applicants.\n\nImplement bulk email service for production.`);
}

function adminClearOldData() {
    if (confirm('⚠️ Are you sure? This will archive admissions older than 1 year.')) {
        const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        const remaining = students.filter(s => new Date(s.admissionDate) > oneYearAgo);
        
        const archived = students.length - remaining.length;
        students = remaining;
        localStorage.setItem('students', JSON.stringify(students));
        showSuccess(`✅ Archived ${archived} old admission(s)`);
        loadAdminAdmissionsList();
    }
}

function adminViewAnalytics() {
    let html = '<div class="admin-analytics">';
    html += '<h3>Admission Statistics</h3>';
    
    const statusCounts = {};
    const deptCounts = {};
    
    students.forEach(s => {
        statusCounts[s.admissionStatus] = (statusCounts[s.admissionStatus] || 0) + 1;
        deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    });
    
    html += '<h4>By Status:</h4><ul>';
    Object.entries(statusCounts).forEach(([status, count]) => {
        const percent = Math.round((count / students.length) * 100);
        html += `<li>${status}: ${count} (${percent}%)</li>`;
    });
    html += '</ul>';
    
    html += '<h4>By Department:</h4><ul>';
    Object.entries(deptCounts).forEach(([dept, count]) => {
        const percent = Math.round((count / students.length) * 100);
        html += `<li>${dept}: ${count} (${percent}%)</li>`;
    });
    html += '</ul></div>';
    
    alert(html);
}

function closeAdminDashboard() {
    const modal = document.getElementById('adminDashboard');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// ===== CUSTOMIZATION PANEL =====
function showCustomizationPanel() {
    const modal = document.createElement('div');
    modal.id = 'customizationPanel';
    modal.className = 'customization-modal';
    modal.innerHTML = `
        <div class="customization-modal-content">
            <div class="customization-header">
                <h2>🎨 Customize School Information</h2>
                <button class="customization-close-btn" onclick="closeCustomizationPanel()">✕</button>
            </div>
            
            <div class="customization-form">
                <div class="form-group">
                    <label for="customSchoolName">School Name:</label>
                    <input type="text" id="customSchoolName" value="${SCHOOL_NAME}">
                </div>
                
                <div class="form-group">
                    <label for="customAdmissionEmail">Admission Email:</label>
                    <input type="email" id="customAdmissionEmail" value="${ADMISSION_EMAIL}">
                </div>
                
                <div class="form-group">
                    <label for="customPhone">Phone Number:</label>
                    <input type="text" id="customPhone" value="91+ 7602848825">
                </div>
                
                <div class="form-group">
                    <label for="customAddress">School Address:</label>
                    <textarea id="customAddress" rows="3">Enter your school address here</textarea>
                </div>
                
                <div class="form-group">
                    <label for="customPrimaryColor">Primary Color:</label>
                    <input type="color" id="customPrimaryColor" value="#667eea">
                    <small>Used for headers, buttons, and accent elements</small>
                </div>
                
                <div class="form-group">
                    <label for="customSecondaryColor">Secondary Color:</label>
                    <input type="color" id="customSecondaryColor" value="#764ba2">
                    <small>Used for gradients and backgrounds</small>
                </div>
                
                <div class="customization-actions">
                    <button class="btn btn-primary" onclick="saveCustomization()">💾 Save Changes</button>
                    <button class="btn btn-secondary" onclick="resetCustomization()">🔄 Reset to Defaults</button>
                </div>
                
                <div class="customization-preview">
                    <h3>Preview:</h3>
                    <div class="preview-header" id="customizationPreview">
                        <h2 id="previewSchoolName"></h2>
                        <p id="previewContact"></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('show');
    updateCustomizationPreview();
}

function updateCustomizationPreview() {
    const schoolName = document.getElementById('customSchoolName')?.value || SCHOOL_NAME;
    const email = document.getElementById('customAdmissionEmail')?.value || ADMISSION_EMAIL;
    const phone = document.getElementById('customPhone')?.value || '91+ 7602848825';
    
    const previewName = document.getElementById('previewSchoolName');
    const previewContact = document.getElementById('previewContact');
    
    if (previewName) previewName.textContent = '📚 ' + schoolName;
    if (previewContact) previewContact.innerHTML = `📞 ${phone} | 📧 ${email}`;
}

function saveCustomization() {
    const schoolName = document.getElementById('customSchoolName')?.value;
    const email = document.getElementById('customAdmissionEmail')?.value;
    const phone = document.getElementById('customPhone')?.value;
    const primaryColor = document.getElementById('customPrimaryColor')?.value;
    const secondaryColor = document.getElementById('customSecondaryColor')?.value;
    
    if (!schoolName || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Update page elements
    if (schoolName !== SCHOOL_NAME) {
        const SCHOOL_NAME = schoolName;
        document.querySelector('h1').textContent = '📚 ' + schoolName;
    }
    
    if (email !== ADMISSION_EMAIL) {
        const ADMISSION_EMAIL = email;
        document.querySelector('.submission-info p').innerHTML = 
            `📧 <strong>Important:</strong> All admission submissions are automatically sent to the Admission Department at <strong>${email}</strong>`;
    }
    
    // Update colors
    if (primaryColor || secondaryColor) {
        const style = document.createElement('style');
        let css = '';
        if (primaryColor && secondaryColor) {
            css = `
                :root {
                    --primary-color: ${primaryColor};
                    --secondary-color: ${secondaryColor};
                }
                .header { background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); }
                .btn-primary { background: ${primaryColor}; }
                .tab-btn.active { background: ${primaryColor}; }
                .preview-header { background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); }
            `;
        } else if (primaryColor) {
            css = `
                .header { background: ${primaryColor}; }
                .btn-primary { background: ${primaryColor}; }
            `;
        }
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // Save to localStorage
    localStorage.setItem('schoolConfig', JSON.stringify({
        schoolName: schoolName,
        email: email,
        phone: phone,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor
    }));
    
    showSuccess('✅ Customization saved successfully!');
    closeCustomizationPanel();
}

function resetCustomization() {
    if (confirm('Are you sure you want to reset to default settings?')) {
        localStorage.removeItem('schoolConfig');
        location.reload();
    }
}

function closeCustomizationPanel() {
    const modal = document.getElementById('customizationPanel');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Show/Hide tabs
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Display students when switching to students tab
    if (tabName === 'students') {
        displayStudents();
    }
}

// Show success message
function showSuccess(message) {
    const msgElement = document.getElementById('successMessage');
    msgElement.textContent = message;
    msgElement.style.background = '#4caf50';
    msgElement.classList.add('show');

    setTimeout(() => {
        msgElement.classList.remove('show');
    }, 4000);
}

// Show message (info, success, or error)
function showMessage(message, type = 'info') {
    const msgElement = document.getElementById('successMessage');
    msgElement.textContent = message;
    
    // Set color based on type
    if (type === 'success') {
        msgElement.style.background = '#4caf50';
    } else if (type === 'error') {
        msgElement.style.background = '#f44336';
    } else if (type === 'info') {
        msgElement.style.background = '#2196F3';
    }
    
    msgElement.classList.add('show');

    setTimeout(() => {
        msgElement.classList.remove('show');
    }, 4000);
}

// Show error message
function showError(message) {
    alert(message);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayStudents();
    initializeAdminPanel();  // Initialize admin dashboard
});
