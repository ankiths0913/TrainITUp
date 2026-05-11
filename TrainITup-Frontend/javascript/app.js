// --- CONFIGURATION ---
// Updated to match Backend endpoints
const API_COURSE_BASE = "http://localhost:8080/api/courses";
const API_BASE_URL = API_COURSE_BASE + "/all";
const ADMIN_API = "http://localhost:8080/api/auth";
const ENROLL_API = "http://localhost:8080/api/enrollments";

// --- HELPER: Get JWT Token from LocalStorage ---
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// --- 1. HOME PAGE LOGIC (index.html) ---
// --- 1. HOME PAGE LOGIC (index.html) ---
async function loadCourses() {
    const container = document.getElementById('course-container');
    if (!container) return;

    // Stylish loading state
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-success" role="status"></div>
            <p class="mt-2 text-muted">Fetching world-class courses...</p>
        </div>`;

    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const courses = await response.json();
        container.innerHTML = ''; 

        if (courses.length === 0) {
            container.innerHTML = '<p class="text-center w-100">No courses available yet.</p>';
            return;
        }

        courses.forEach(course => {
            const rating = course.rating || 4.8;
            const studentCount = course.studentCount || Math.floor(Math.random() * 5000) + 1000;
            const courseHTML = `
                <div class="col-lg-3 col-md-6 mb-4 d-flex">
                    <article class="marketplace-course-card w-100 d-flex flex-column">
                        <div class="marketplace-course-image-wrap">
                            <img src="${course.imageUrl}" class="marketplace-course-image" alt="${course.title}">
                        </div>

                        <div class="marketplace-course-body d-flex flex-column flex-grow-1">
                            <div class="marketplace-header-wrapper">
                                <span class="marketplace-badge">Development</span>
                                <h5 class="marketplace-course-title">${course.title}</h5>
                            </div>

                            <div class="d-flex align-items-center mb-2 marketplace-educator-row">
                                <img src="../assets/images/avatar/avatar-1.jpg" class="rounded-circle me-2 marketplace-educator-avatar" alt="Educator avatar">
                                <span class="marketplace-educator-text">By <span class="marketplace-educator-name">${course.educator}</span></span>
                            </div>

                            <div class="d-flex align-items-center mb-3 text-warning small marketplace-rating-row">
                                <i class="bi bi-star-fill me-1"></i>
                                <span class="fw-bold">${rating}</span>
                                <span class="marketplace-student-count">(${studentCount} students)</span>
                            </div>

                            <div class="d-flex justify-content-between align-items-center marketplace-footer mt-auto pt-3 border-top">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-book text-success me-2"></i>
                                    <span class="small marketplace-lessons">${course.lessons} Lessons</span>
                                </div>
                                <h5 class="mb-0 fw-bold text-success marketplace-price">$${course.price}</h5>
                            </div>

                            <button class="btn marketplace-join-btn w-100 rounded-pill mt-3 py-2 fw-bold shadow-sm" onclick="enrollUser(event, ${course.id})">
                                Join Now <i class="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </article>
                </div>`;
            container.innerHTML += courseHTML;
        });
    } catch (error) {
        console.error("Home Page Error:", error);
        // Fallback sample courses so UI remains usable when backend is down
        const fallback = [
            { id: 101, title: 'Intro to Java', educator: 'Chetan Patil', lessons: 12, price: 0, imageUrl: '../assets/images/hero-img.jpg', rating: 4.9, studentCount: 2400 },
            { id: 102, title: 'Web Development Basics', educator: 'Anna Smith', lessons: 20, price: 19, imageUrl: '../assets/images/hero-img.jpg', rating: 4.8, studentCount: 1800 },
            { id: 103, title: 'Design Fundamentals', educator: 'Alex Doe', lessons: 8, price: 9, imageUrl: '../assets/images/hero-img.jpg', rating: 4.7, studentCount: 1500 }
        ];

        container.innerHTML = '';
        fallback.forEach(course => {
            const courseHTML = `
                <div class="col-lg-3 col-md-6 mb-4 d-flex">
                    <article class="marketplace-course-card w-100 d-flex flex-column">
                        <div class="marketplace-course-image-wrap">
                            <img src="${course.imageUrl}" class="marketplace-course-image" alt="${course.title}">
                        </div>

                        <div class="marketplace-course-body d-flex flex-column flex-grow-1">
                            <div class="marketplace-header-wrapper">
                                <span class="marketplace-badge">Development</span>
                                <h5 class="marketplace-course-title">${course.title}</h5>
                            </div>

                            <div class="d-flex align-items-center mb-2 marketplace-educator-row">
                                <img src="../assets/images/avatar/avatar-1.jpg" class="rounded-circle me-2 marketplace-educator-avatar" alt="Educator avatar">
                                <span class="marketplace-educator-text">By <span class="marketplace-educator-name">${course.educator}</span></span>
                            </div>

                            <div class="d-flex align-items-center mb-3 text-warning small marketplace-rating-row">
                                <i class="bi bi-star-fill me-1"></i>
                                <span class="fw-bold">${course.rating}</span>
                                <span class="marketplace-student-count">(${course.studentCount} students)</span>
                            </div>

                            <div class="d-flex justify-content-between align-items-center marketplace-footer mt-auto pt-3 border-top">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-book text-success me-2"></i>
                                    <span class="small marketplace-lessons">${course.lessons} Lessons</span>
                                </div>
                                <h5 class="mb-0 fw-bold text-success marketplace-price">$${course.price}</h5>
                            </div>

                            <button class="btn marketplace-join-btn w-100 rounded-pill mt-3 py-2 fw-bold shadow-sm" onclick="enrollUser(event, ${course.id})">
                                Join Now <i class="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </article>
                </div>`;
            container.innerHTML += courseHTML;
        });
    }
}

// --- 2. ENROLLMENT LOGIC ---
async function enrollUser(e, courseId) {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');

    if (!userId) {
        alert("Please login first to join a course!");
        window.location.replace("login.html");
        return;
    }

    if (role === 'ADMIN' || role === 'TEACHER') {
        alert("Only students can enroll in courses!");
        return;
    }
    // Try to extract course metadata from the card for offline fallback
    let courseMeta = { id: courseId, title: '', educator: '', imageUrl: '' };
    try {
        const card = e?.target?.closest('.card');
        if (card) {
            courseMeta.title = card.querySelector('.card-title')?.innerText || '';
            courseMeta.educator = card.querySelector('.text-dark')?.innerText || '';
            courseMeta.imageUrl = card.querySelector('img')?.src || '';
        }
    } catch (err) {
        console.warn('Could not extract course metadata', err);
    }

    try {
        const response = await fetch(`${ENROLL_API}/join`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ userId: parseInt(userId), courseId: courseId })
        });

        if (response.ok) {
            alert("✅ Successfully enrolled!");
            window.location.href = "my-courses.html";
            return;
        } else {
            const errorMsg = await response.text();
            console.warn('Enroll API error:', errorMsg);
            // fall through to local fallback
        }
    } catch (error) {
        console.warn("Enroll failed, falling back to local enrollments.", error);
    }

    // Local fallback: persist enrollment locally
    const local = JSON.parse(localStorage.getItem('localEnrollments') || '[]');
    if (!local.find(c => c.id == courseId)) {
        local.push(courseMeta);
        localStorage.setItem('localEnrollments', JSON.stringify(local));
    }
    alert("✅ Enrolled (offline fallback). You can continue from My Learning.");
    window.location.href = "my-courses.html";
}

// --- 3. COURSE DETAIL PAGE LOGIC ---
async function loadCourseDetails() {
    const titleElem = document.getElementById('courseTitle');
    if (!titleElem) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (courseId) {
        try {
            // Try single-course endpoint first, fallback to the "all" endpoint
            let response = await fetch(`${API_COURSE_BASE}/${courseId}`);
            let data;
            if (response.ok) {
                data = await response.json();
            } else {
                response = await fetch(API_BASE_URL);
                data = await response.json();
                if (Array.isArray(data)) data = data.find(c => c.id == courseId);
            }

            const course = data;
            if (course) {
                document.getElementById('courseTitle').innerText = course.title;
                document.getElementById('courseEducator').innerText = `Taught by ${course.educator}`;
                
                const videoPlayer = document.getElementById('videoPlayer');
                if (course.videoUrl) {
                    videoPlayer.src = course.videoUrl;
                } else {
                    videoPlayer.src = "https://www.youtube.com/embed/dQw4w9WgXcQ"; 
                }
            }
        } catch (error) {
            console.error("Detail Page Error:", error);
        }
    }
}

// --- 4. DASHBOARD LOGIC (my-courses.html) ---
async function loadMyJoinedCourses() {
    const container = document.getElementById('my-courses-container');
    if (!container) return;

    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-success" role="status"></div>
        </div>`;

    try {
        const userId = localStorage.getItem('userId');
        if (userId) {
            const resp = await fetch(`${ENROLL_API}/user/${userId}`, {
                headers: getAuthHeaders()
            });
            if (resp.ok) {
                const joined = await resp.json();
                renderMyCourses(container, joined);
                return;
            }
        }
    } catch (err) {
        console.warn('Could not load joined courses from backend, using local fallback.', err);
    }

    // local fallback from localStorage
    const localJoined = JSON.parse(localStorage.getItem('localEnrollments') || '[]');
    renderMyCourses(container, localJoined);
}

function renderMyCourses(container, courses) {
    container.innerHTML = '';
    if (!courses || courses.length === 0) {
        container.innerHTML = '<p class="text-center w-100">You have not joined any courses yet.</p>';
        return;
    }

    courses.forEach(course => {
        container.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card course-card shadow-sm h-100 rounded-5">
                    <div class="position-relative overflow-hidden">
                        <img src="${course.imageUrl || '../assets/images/hero-img.jpg'}" class="rounded-top-5 card-img-top" style="height: 180px; object-fit: cover;" alt="Course">
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <h5 class="fw-bold mb-2">${course.title}</h5>
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <img src="../assets/images/avatar/avatar-6.jpg" class="rounded-circle" style="width: 25px; height: 25px;">
                            <span class="text-muted small">${course.educator || ''}</span>
                        </div>
                        <div class="mt-auto border-top pt-3">
                            <button class="btn btn-dark w-100 rounded-pill" onclick="viewCourse(${course.id})">
                                Continue Learning <i class="bi bi-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

function viewCourse(id) {
    window.location.href = `course-detail.html?id=${id}`;
}

// --- INITIALIZATION ---
window.onload = () => {
    // Smart loader: only runs functions if the page has the right HTML ID
    if (document.getElementById('course-container')) loadCourses();        
    if (document.getElementById('courseTitle')) loadCourseDetails();
    if (document.getElementById('my-courses-container')) loadMyJoinedCourses(); 
};