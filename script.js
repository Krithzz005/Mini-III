// Base URL for your backend API
const API_BASE_URL="https://mini-iii-4hj6.onrender.com/api";
// --- DOM Elements ---
const focusLoginContainer = document.getElementById('focus-login-container');
const loginWindow = document.getElementById('login-window');
const unlockButton = document.getElementById('unlock-button');
const loginFormWrapper = document.getElementById('login-form-wrapper');
const appLayout = document.getElementById('app-layout');

// Views within the Focus Window
const signinView = document.getElementById('signin-view');
const signupView = document.getElementById('signup-view');
const forgotPasswordView = document.getElementById('forgot-password-view');

// Messages
const signinMessage = document.getElementById('signin-message');
const signupMessage = document.getElementById('signup-message');
const forgotPasswordMessage = document.getElementById('forgot-password-message');

// Forms and Links
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

const showSignup = document.getElementById('show-signup');
const showSignin = document.getElementById('show-signin');
const showForgotPasswordLink = document.getElementById('show-forgot-password');
const backToSigninLink = document.getElementById('back-to-signin');

// Main App Elements
const addTaskForm = document.getElementById('add-task-form');
const taskBoard = document.getElementById('task-board');
const logo = document.getElementById('logo');
const vaultModal = document.getElementById('vault-modal');
const closeVaultModal = document.getElementById('close-vault-modal');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const copyrightYear = document.getElementById('copyright-year');
const taskSearchInput = document.getElementById('task-search');

// Sidebar navigation links
const dashboardLink = document.getElementById('dashboard-link');
const adminPanelLink = document.getElementById('admin-panel-link');
const showAdminPanelBtn = document.getElementById('show-admin-panel');

// Main content sections
const dashboardSection = document.getElementById('dashboard');
const adminDashboardSection = document.getElementById('admin-dashboard-section');

// Admin Dashboard elements
const adminUsersList = document.getElementById('admin-users-list');
const adminAllTasksList = document.getElementById('admin-all-tasks-list');


// Task Details Modal elements
const taskDetailsModal = document.getElementById('task-details-modal');
const modalCloseBtn = taskDetailsModal.querySelector('.close-button');
const modalTaskTitle = document.getElementById('modal-task-title');
const modalTaskStatus = document.getElementById('modal-task-status');
const modalTaskPriority = document.getElementById('modal-task-priority');
const modalTaskDueDate = document.getElementById('modal-task-due-date');
const modalTaskCreatedAt = document.getElementById('modal-task-created-at');
const modalTaskDescription = document.getElementById('modal-task-description');
const saveTaskDetailsBtn = document.getElementById('save-task-details-btn');
let currentTaskToEdit = null;

// Generic Modal elements (for alerts and confirmations)
const genericModal = document.getElementById('generic-modal');
const genericModalTitle = document.getElementById('generic-modal-title');
const genericModalMessage = document.getElementById('generic-modal-message');
const genericModalActions = document.getElementById('generic-modal-actions');
const genericModalCloseBtn = document.getElementById('generic-modal-close-btn');

// NEW: User Profile DOM Elements
const userMenuButton = document.getElementById('user-menu-button');
const userDropdownMenu = document.getElementById('user-dropdown-menu');
const userEmailDisplay = document.getElementById('user-email-display');
const profileLink = document.getElementById('profile-link');
const signoutLink = document.getElementById('signout-link');
const profilePage = document.getElementById('profile-page');
const profileForm = document.getElementById('profile-form');
const profileEmailInput = document.getElementById('profile-email');
const profileNameInput = document.getElementById('profile-name');
const profilePasswordInput = document.getElementById('profile-password');
const profileMessage = document.getElementById('profile-message');

// NEW: File Storage DOM Elements (Added from your request)
const fileStorageLink = document.getElementById('file-storage-link'); // Sidebar link
const fileStoragePage = document.getElementById('file-storage-page'); // Main page container
const fileUploadInput = document.getElementById('file-upload-input');
const triggerUploadBtn = document.getElementById('trigger-upload-btn');
const dropZone = document.getElementById('drop-zone');
const fileListDisplay = document.getElementById('file-list');
// NEW: Stored Files List Element
const storedFilesList = document.getElementById('stored-files-list');


// Global variable to store user role
let currentUserRole = 'user'; // Default to user

// NEW: Global array to hold locally stored files (simulated persistence)
let storedFiles = []; 


// --- Helper Functions ---

// Function to decode JWT token
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

// Displays a message on the UI (e.g., login errors, success messages)
function displayMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`; // Applies 'success' or 'error' class for styling
}

// Controls UI visibility based on authentication state
function showLogin() {
    // Hide the main app layout and show the login container
    appLayout.classList.add('hidden');
    focusLoginContainer.classList.remove('hidden');

    // Reset the login/signup form state
    loginWindow.classList.remove('success', 'expanded'); // Ensure expanded class is removed on logout/initial load
    loginFormWrapper.classList.add('collapsed');
    
    // Always show sign-in view first on login page load/reset
    signinView.classList.remove('hidden');
    signupView.classList.add('hidden');
    forgotPasswordView.classList.add('hidden'); // Ensure forgot password is hidden
    
    displayMessage(signinMessage, '', ''); // Clear messages
    displayMessage(signupMessage, '', '');
    displayMessage(forgotPasswordMessage, '', ''); // Clear forgot password messages

    // Hide admin link on logout
    adminPanelLink.classList.add('hidden');
    currentUserRole = 'user'; // Reset role
}

// Shows the main application dashboard
function showApp() {
    focusLoginContainer.classList.add('hidden');
    appLayout.classList.remove('hidden');
    // Once logged in, remove the `success` class to allow re-expanding for vault (if needed)
    loginWindow.classList.remove('success');
}

/**
 * Function to show a specific page (dashboard, admin, profile, or file-storage)
 * @param {string} pageId - The ID of the page to show.
 * @param {string} activeLinkId - The ID of the sidebar link to mark as active.
 */
function showPage(pageId, activeLinkId) {
    const pages = [dashboardSection, adminDashboardSection, profilePage, fileStoragePage];
    const links = [dashboardLink, adminPanelLink, profileLink, fileStorageLink];

    pages.forEach(page => {
        if (page && page.id === pageId) {
            page.classList.remove('hidden');
        } else if (page) {
            page.classList.add('hidden');
        }
    });

    // Update sidebar active state
    links.forEach(link => {
        if (link) {
            // Check if the link is nested in an <li> (like dashboardLink and adminPanelLink usually are)
            const parentLi = link.closest('li');
            if (parentLi) {
                if (link.id === activeLinkId) {
                    parentLi.classList.add('active');
                } else {
                    parentLi.classList.remove('active');
                }
            } else if (link.id === activeLinkId) {
                // Handle links not in <li> (like profileLink in the dropdown)
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });

    // Handle Admin Panel button state separately if needed
    if (adminPanelLink) {
        if (activeLinkId === 'admin-panel-link') {
            adminPanelLink.classList.add('active');
        } else {
            adminPanelLink.classList.remove('active');
        }
    }
}


/**
 * Shows a generic modal for alerts or confirmations.
 * @param {string} title - The title for the modal.
 * @param {string} message - The message content for the modal.
 * @param {Array<Object>} buttonsConfig - An array of button configurations.
 * Each object: { text: string, className: string, onClick: Function }
 * @param {Function} onCloseCallback - Optional callback when the modal is closed without button interaction.
 */
function showGenericModal(title, message, buttonsConfig = [], onCloseCallback = () => {}) {
    genericModalTitle.textContent = title;
    genericModalMessage.textContent = message;
    genericModalActions.innerHTML = ''; // Clear existing buttons

    buttonsConfig.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.className = btn.className; // e.g., 'vault-btn primary', 'vault-btn secondary'
        button.onclick = () => {
            hideGenericModal();
            if (btn.onClick) {
                btn.onClick();
            }
        };
        genericModalActions.appendChild(button);
    });

    genericModal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    // Store the callback for closing via 'x' button or backdrop click
    genericModal.onCloseCallback = onCloseCallback;
}

function hideGenericModal() {
    genericModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    if (genericModal.onCloseCallback) {
        genericModal.onCloseCallback();
        genericModal.onCloseCallback = null; // Clear callback
    }
}

// Event listeners for generic modal close button and backdrop
if (genericModalCloseBtn) genericModalCloseBtn.addEventListener('click', hideGenericModal);
if (genericModal) {
    genericModal.addEventListener('click', (e) => {
        if (e.target === genericModal) {
            hideGenericModal();
        }
    });
}

// --- NEW FILE STORAGE FUNCTIONS ---

// NEW Function: Renders the "Your Stored Files" list from the global array
function renderStoredFiles() {
    if (!storedFilesList) return;

    storedFilesList.innerHTML = ''; // Clear the current list (including placeholder)

    if (storedFiles.length === 0) {
        storedFilesList.innerHTML = '<li class="placeholder-text">No files currently stored.</li>';
        return;
    }

    storedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.style.borderBottom = '1px solid var(--border-color)';
        li.style.padding = '0.5rem 0';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        
        li.innerHTML = `
            <div>
                <strong>${file.name}</strong> 
                <span style="font-size:0.8em; opacity:0.7;">(Uploaded: ${file.uploadDate} - ${(file.size / 1024).toFixed(2)} KB)</span>
            </div>
            <button class="delete-file-btn vault-btn secondary" data-index="${index}" style="padding: 0.2rem 0.5rem; background: var(--high-priority-color); color: white; margin-left: 10px;">Delete</button>
        `;
        storedFilesList.appendChild(li);
    });

    // Add event listeners for the new Delete buttons
    storedFilesList.querySelectorAll('.delete-file-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const indexToDelete = parseInt(e.target.dataset.index);
            // In a real app, this would be deleteStoredFile(file.id) 
            deleteStoredFile(indexToDelete); 
        });
    });
}

// NEW Function: Delete Stored File (Simulation)
function deleteStoredFile(index) {
    // 1. Remove file from the array (Simulated server deletion)
    if (index > -1 && index < storedFiles.length) {
        storedFiles.splice(index, 1);
    }
    
    // 2. Re-render the list to update the UI
    renderStoredFiles();
}

// NEW Function: Simulate File Upload and Update Stored List
function simulateFileUpload(filesToUpload) {
    if (!triggerUploadBtn || !fileListDisplay) return;

    // 1. Show Loading State
    const originalText = triggerUploadBtn.textContent;
    triggerUploadBtn.textContent = 'Uploading... Please wait.';
    triggerUploadBtn.disabled = true;

    // 2. Simulate Server Delay (1.5 second)
    setTimeout(() => {
        // 3. Update the global storedFiles array and the UI list
        filesToUpload.forEach(file => {
            const fileData = {
                name: file.name,
                size: file.size,
                uploadDate: new Date().toLocaleDateString()
            };
            storedFiles.push(fileData);
        });

        // 4. Update the "Your Stored Files" section
        renderStoredFiles();

        // 5. Reset the Upload Area and Show Success
        fileListDisplay.innerHTML = `<p style="color: var(--low-priority-color); font-weight: bold; margin: 0;">Upload Success! ${filesToUpload.length} file(s) added.</p>`;
        triggerUploadBtn.textContent = originalText;
        triggerUploadBtn.disabled = false;

        // Clear the actual input field so the user can select new files
        if (fileUploadInput) fileUploadInput.value = null; 
        
    }, 1500); 
}


// --- 2. AUTHENTICATION LOGIC (MongoDB Backend) ---

// Checks if a user token exists in localStorage to determine login state
async function checkAuthStatus() {
    const token = localStorage.getItem('userToken');
    if (token) {
        const decodedToken = decodeJwt(token);
        if (decodedToken && decodedToken.role) {
            currentUserRole = decodedToken.role;
            if (currentUserRole === 'admin') {
                if (adminPanelLink) adminPanelLink.classList.remove('hidden');
            } else {
                if (adminPanelLink) adminPanelLink.classList.add('hidden');
            }
        }
        showApp();
        showPage('dashboard', 'dashboard-link'); // Pass 'dashboard-link' as active link ID
        fetchTasks(); // Load tasks for regular users
        fetchUserProfile();
    } else {
        showLogin();
    }
}

// Handles user sign-up - No automatic login
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        displayMessage(signupMessage, 'Registering...', '');
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(signupMessage, data.message || 'Account created successfully! Please sign in.', 'success');
                // Redirect to sign-in view after successful registration
                signupView.classList.add('hidden');
                signinView.classList.remove('hidden');
                // Clear signup form
                document.getElementById('signup-email').value = '';
                document.getElementById('signup-password').value = '';
            } else {
                displayMessage(signupMessage, data.error || 'Signup failed.', 'error');
            }
        } catch (error) {
            console.error('Signup fetch error:', error);
            displayMessage(signupMessage, 'An error occurred during signup. Please try again.', 'error');
        }
    });
}

// Handles user sign-in
if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        displayMessage(signinMessage, 'Verifying...', '');
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userToken', data.token); // Store the JWT token
                const decodedToken = decodeJwt(data.token);
                if (decodedToken && decodedToken.role) {
                    currentUserRole = decodedToken.role;
                    if (currentUserRole === 'admin') {
                        if (adminPanelLink) adminPanelLink.classList.remove('hidden');
                    } else {
                        if (adminPanelLink) adminPanelLink.classList.add('hidden');
                    }
                }

                loginWindow.classList.add('success'); // Visual feedback for successful login
                setTimeout(() => {
                    showApp();
                    showPage('dashboard', 'dashboard-link');
                    fetchTasks(); // Load tasks after successful login
                    fetchUserProfile();
                }, 600);
            } else {
                displayMessage(signinMessage, data.error || 'Login failed. Check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Signin fetch error:', error);
            displayMessage(signinMessage, 'An error occurred during login. Please try again.', 'error');
        }
    });
}

// Handles forgot password request
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        displayMessage(forgotPasswordMessage, 'Sending reset link...', '');
        const email = document.getElementById('forgot-password-email').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(forgotPasswordMessage, data.message, 'success');
                // Clear email field
                document.getElementById('forgot-password-email').value = '';
                console.warn("NOTE: In a real app, check your email for the reset link (check backend console for token).");
            } else {
                displayMessage(forgotPasswordMessage, data.error || 'Failed to send reset link.', 'error');
            }
        } catch (error) {
            console.error('Forgot password fetch error:', error);
            displayMessage(forgotPasswordMessage, 'An error occurred. Please try again.', 'error');
        }
    });
}

// --- Auth View Toggling ---
if (showSignup) showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    displayMessage(signupMessage, '', ''); // Clear messages
    signinView.classList.add('hidden');
    forgotPasswordView.classList.add('hidden'); // Ensure forgot password is hidden
    signupView.classList.remove('hidden');
});

if (showSignin) showSignin.addEventListener('click', (e) => {
    e.preventDefault();
    displayMessage(signinMessage, '', ''); // Clear messages
    signupView.classList.add('hidden');
    forgotPasswordView.classList.add('hidden'); // Ensure forgot password is hidden
    signinView.classList.remove('hidden');
});

if (showForgotPasswordLink) showForgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    displayMessage(forgotPasswordMessage, '', ''); // Clear messages
    signinView.classList.add('hidden');
    signupView.classList.add('hidden');
    forgotPasswordView.classList.remove('hidden');
});

if (backToSigninLink) backToSigninLink.addEventListener('click', (e) => {
    e.preventDefault();
    displayMessage(signinMessage, '', ''); // Clear messages
    forgotPasswordView.classList.add('hidden');
    signupView.classList.add('hidden'); // Ensure signup is hidden
    signinView.classList.remove('hidden');
});


// --- 3. TASK MANAGEMENT (MongoDB Backend) ---

// Fetches tasks from the backend for the current user
const fetchTasks = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.warn('No token found, cannot fetch tasks.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` } // Send JWT token for authentication
        });

        if (!response.ok) {
            // If token is invalid or expired, force sign out
            if (response.status === 401) {
                localStorage.removeItem('userToken');
                showLogin();
                displayMessage(signinMessage, 'Session expired. Please sign in again.', 'error');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

// Renders tasks onto the Kanban board columns
const renderTasks = (tasks) => {
    // Clear existing tasks from all columns
    const todoColumn = document.getElementById('To Do');
    const inProgressColumn = document.getElementById('In Progress');
    const doneColumn = document.getElementById('Done');

    if (todoColumn) todoColumn.innerHTML = '<h2>To Do</h2>';
    if (inProgressColumn) inProgressColumn.innerHTML = '<h2>In Progress</h2>';
    if (doneColumn) doneColumn.innerHTML = '<h2>Done</h2>';

    tasks.forEach(task => {
        const column = document.getElementById(task.status);
        if (column) {
            const card = document.createElement('div');
            card.className = `task-card priority-${task.priority.toLowerCase()}`;
            card.id = `task-${task._id}`; // Use MongoDB's _id
            card.draggable = true;
            card.dataset.id = task._id; // Store _id for drag/drop and details

            const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Due Date';

            card.innerHTML = `
                <h3>${task.title}</h3>
                <p class="task-priority">${task.priority} Priority</p>
                <p class="task-due-date">Due: ${dueDate}</p>
                <div class="task-actions">
                    <button class="delete-task-btn" data-task-id="${task._id}" title="Delete Task">×</button>
                </div>
            `;
            card.addEventListener('dragstart', dragStart);
            // Event listener for task details modal
            card.addEventListener('click', (e) => {
                // Only show modal if delete button wasn't clicked
                if (!e.target.closest('.delete-task-btn')) {
                    showTaskDetailsModal(task);
                }
            });
            column.appendChild(card);
        }
    });
};

// Adds a new task
if (addTaskForm) {
    addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('task-title');
        const priorityInput = document.getElementById('task-priority');
        const dueDateInput = document.getElementById('task-due-date'); // New due date input

        const title = titleInput.value.trim();
        const priority = priorityInput.value;
        const due_date = dueDateInput.value || null; // Capture due date, or null if empty
        const token = localStorage.getItem('userToken');

        if (title && token) {
            try {
                const response = await fetch(`${API_BASE_URL}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, priority, due_date, status: 'To Do' })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Task added successfully, refresh the task list
                titleInput.value = '';
                priorityInput.value = 'Medium'; // Reset to default
                dueDateInput.value = ''; // Clear date input
                fetchTasks();
            } catch (error) {
                console.error('Error adding task:', error);
                showGenericModal(
                    "Error",
                    "Failed to add task. Please try again.",
                    [{ text: "OK", className: "vault-btn primary" }]
                );
            }
        }
    });
}

// Handles task deletion via event delegation
if (taskBoard) {
    taskBoard.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-task-btn')) {
            const taskId = e.target.getAttribute('data-task-id');
            
            showGenericModal(
                "Confirm Deletion",
                "Are you sure you want to delete this task?",
                [
                    { text: "Delete", className: "vault-btn primary", onClick: async () => {
                        const token = localStorage.getItem('userToken');
                        if (!token) return;

                        try {
                            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });

                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            fetchTasks(); // Refresh tasks after deletion
                        } catch (error) {
                            console.error('Error deleting task:', error);
                            showGenericModal(
                                "Error",
                                "Failed to delete task. Please try again.",
                                [{ text: "OK", className: "vault-btn primary" }]
                            );
                        }
                    }},
                    { text: "Cancel", className: "vault-btn secondary" }
                ]
            );
        }
    });
}

// --- Search and Filter Logic ---
if (taskSearchInput) taskSearchInput.addEventListener('input', filterTasks);

function filterTasks() {
    const searchTerm = taskSearchInput.value.toLowerCase();
    const tasks = document.querySelectorAll('.task-card');

    tasks.forEach(task => {
        const title = task.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}

// --- 4. DRAG-AND-DROP LOGIC ---
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

// Global drop function for drag-and-drop
window.drop = async (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(taskId);
    const targetColumn = e.target.closest('.task-column'); // Find the closest task column
    document.querySelectorAll('.task-card').forEach(card => card.classList.remove('dragging')); // Remove dragging class

    if (draggedElement && targetColumn) {
        const newStatus = targetColumn.id; // Get the ID of the column (e.g., "To Do", "In Progress")

        // Append the dragged card to the new column
        targetColumn.appendChild(draggedElement);

        // Update task status in the backend
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${draggedElement.dataset.id}`, { // Use dataset.id for MongoDB _id
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Optionally, re-fetch tasks if complex re-ordering or state management is needed
            // fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
            showGenericModal(
                "Error",
                "Failed to update task status. Please try again.",
                [{ text: "OK", className: "vault-btn primary" }]
            );
        }
    }
};

// --- 5. UI & SECRET VAULT LOGIC ---
if (themeToggle) themeToggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

let clickCount = 0;
if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        setTimeout(() => { clickCount = 0; }, 600); // Reset count if not clicked rapidly
        if (clickCount === 3) {
            clickCount = 0;
            if (vaultModal) vaultModal.classList.remove('hidden'); // Show the vault modal
        }
    });
}
if (closeVaultModal) closeVaultModal.addEventListener('click', () => {
    if (vaultModal) vaultModal.classList.add('hidden');
}); // Hide vault modal

// --- 6. Menu Toggle Logic ---
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (sidebar) sidebar.classList.toggle('collapsed');
    });
}

// --- Task Details Modal Logic ---
function showTaskDetailsModal(task) {
    currentTaskToEdit = task; // Store the task object being viewed/edited
    if (modalTaskTitle) modalTaskTitle.textContent = task.title;
    if (modalTaskStatus) modalTaskStatus.textContent = task.status;
    if (modalTaskPriority) modalTaskPriority.textContent = task.priority;
    if (modalTaskDueDate) modalTaskDueDate.textContent = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A';
    if (modalTaskCreatedAt) modalTaskCreatedAt.textContent = new Date(task.created_at).toLocaleString();
    if (modalTaskDescription) modalTaskDescription.value = task.description || ''; // Display existing description or empty string

    if (taskDetailsModal) taskDetailsModal.classList.remove('hidden');
    document.body.classList.add('modal-open'); // Add a class to body to prevent scrolling
}

function hideTaskDetailsModal() {
    if (taskDetailsModal) taskDetailsModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    currentTaskToEdit = null; // Clear the task being edited
}

// Event listeners for task details modal
if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideTaskDetailsModal);
// Close modal if backdrop is clicked
if (taskDetailsModal) {
    taskDetailsModal.addEventListener('click', (e) => {
        if (e.target === taskDetailsModal) {
            hideTaskDetailsModal();
        }
    });
}

// Save updated task details (e.g., description)
if (saveTaskDetailsBtn) {
    saveTaskDetailsBtn.addEventListener('click', async () => {
        if (!currentTaskToEdit) return;

        const newDescription = modalTaskDescription.value;
        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${currentTaskToEdit._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ description: newDescription })
            });

            if (response.ok) {
                currentTaskToEdit.description = newDescription; // Update local object
                hideTaskDetailsModal();
                fetchTasks(); // Re-fetch tasks to ensure UI consistency if needed (though not strictly for description)
            } else {
                const errorData = await response.json();
                console.error('Error saving task details:', errorData.error);
                showGenericModal(
                    "Error",
                    "Failed to save task details: " + (errorData.error || 'Unknown error'),
                    [{ text: "OK", className: "vault-btn primary" }]
                );
            }
        } catch (error) {
            console.error('Error in saveTaskDetails fetch:', error);
            showGenericModal(
                "Error",
                "An error occurred while saving task details.",
                [{ text: "OK", className: "vault-btn primary" }]
            );
        }
    });
}

// --- ADMIN PANEL LOGIC ---

// Function to show the admin dashboard and hide the regular dashboard
function showAdminDashboard() {
    showPage('admin-dashboard-section', 'admin-panel-link');
    fetchAllUsers();
    fetchAllTasksForAdmin(); // Fetch all tasks for admin view
}

// Function to show the regular dashboard and hide the admin dashboard
function showRegularDashboard() {
    showPage('dashboard', 'dashboard-link');
    fetchTasks(); // Re-fetch tasks for regular user view
}

// Event listener for Admin Panel link
if (showAdminPanelBtn) {
    showAdminPanelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUserRole === 'admin') {
            showAdminDashboard();
        } else {
            showGenericModal("Access Denied", "You do not have administrative privileges.", [{ text: "OK", className: "vault-btn primary" }]);
        }
    });
}

// Event listener for Dashboard link
if (dashboardLink) {
    dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegularDashboard();
    });
}


// Fetches all users for admin view
const fetchAllUsers = async () => {
    const token = localStorage.getItem('userToken');
    if (!token || currentUserRole !== 'admin') {
        console.warn('Not authorized to fetch all users.');
        if (adminUsersList) adminUsersList.innerHTML = '<p class="placeholder-text">Access Denied: Admin privileges required.</p>';
        return;
    }

    if (adminUsersList) adminUsersList.innerHTML = '<p class="placeholder-text">Loading users...</p>'; // Show loading indicator

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                showGenericModal("Access Denied", "You do not have permission to view users.", [{ text: "OK", className: "vault-btn primary" }]);
                if (adminUsersList) adminUsersList.innerHTML = '<p class="placeholder-text">Access Denied: Admin privileges required.</p>';
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        renderUsersForAdmin(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        if (adminUsersList) adminUsersList.innerHTML = '<p class="placeholder-text">Failed to load users.</p>';
    }
};

// Renders users in the admin user list with role dropdown and save button
const renderUsersForAdmin = (users) => {
    if (!adminUsersList) return;
    adminUsersList.innerHTML = ''; // Clear existing list
    if (users.length === 0) {
        adminUsersList.innerHTML = '<p class="placeholder-text">No users found.</p>';
        return;
    }

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card task-card'; // Reusing task-card styling for consistency
        userCard.innerHTML = `
            <h3>${user.email}</h3>
            <p>ID: ${user._id}</p>
            <div class="user-role-control">
                <label for="role-select-${user._id}">Role:</label>
                <select id="role-select-${user._id}" class="role-select ${user.role === 'admin' ? 'role-admin' : 'role-user'}">
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
                <button class="save-role-btn vault-btn primary" data-user-id="${user._id}" data-original-role="${user.role}">Save Role</button>
            </div>
            <div class="user-actions">
                <button class="delete-user-btn" data-user-id="${user._id}" title="Delete User">Delete User</button>
            </div>
        `;
        adminUsersList.appendChild(userCard);

        // Add event listener for role select change to enable/disable save button
        const roleSelect = userCard.querySelector(`#role-select-${user._id}`);
        const saveRoleBtn = userCard.querySelector(`.save-role-btn`);

        // Disable save button initially if no change
        saveRoleBtn.disabled = true;

        roleSelect.addEventListener('change', () => {
            if (roleSelect.value !== saveRoleBtn.dataset.originalRole) {
                saveRoleBtn.disabled = false; // Enable if role changed
                roleSelect.classList.remove('role-user', 'role-admin');
                roleSelect.classList.add(`role-${roleSelect.value}`);
            } else {
                saveRoleBtn.disabled = true; // Disable if reverted to original
                roleSelect.classList.remove('role-user', 'role-admin');
                roleSelect.classList.add(`role-${roleSelect.value}`);
            }
        });
        
        // --- Add event listeners for buttons within the card ---
        
        // Delete User Button
        userCard.querySelector('.delete-user-btn').addEventListener('click', (e) => {
            const userIdToDelete = e.target.dataset.userId;
            showGenericModal(
                "Confirm User Deletion",
                `Are you sure you want to delete user: ${user.email}? This action cannot be undone.`,
                [
                    { text: "Delete User", className: "vault-btn primary", onClick: () => deleteUser(userIdToDelete) },
                    { text: "Cancel", className: "vault-btn secondary" }
                ]
            );
        });

        // Save Role Button
        saveRoleBtn.addEventListener('click', (e) => {
            const userIdToUpdate = e.target.dataset.userId;
            const newRole = roleSelect.value;
            showGenericModal(
                "Confirm Role Change",
                `Are you sure you want to change the role of ${user.email} to "${newRole}"?`,
                [
                    { text: "Change Role", className: "vault-btn primary", onClick: () => updateUserRole(userIdToUpdate, newRole) },
                    { text: "Cancel", className: "vault-btn secondary" }
                ]
            );
        });
    });
};

// Updates a user's role (admin action)
const updateUserRole = async (userId, newRole) => {
    const token = localStorage.getItem('userToken');
    if (!token || currentUserRole !== 'admin') {
        showGenericModal("Access Denied", "You do not have permission to change user roles.", [{ text: "OK", className: "vault-btn primary" }]);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, { // New endpoint for role update
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newRole })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        showGenericModal("Success", `User role updated to ${newRole}.`, [{ text: "OK", className: "vault-btn primary" }]);
        fetchAllUsers(); // Refresh user list to reflect changes
    } catch (error) {
        console.error('Error updating user role:', error);
        showGenericModal("Error", `Failed to update user role: ${error.message}`, [{ text: "OK", className: "vault-btn primary" }]);
    }
};


// Deletes a user (admin action)
const deleteUser = async (userId) => {
    const token = localStorage.getItem('userToken');
    if (!token || currentUserRole !== 'admin') {
        showGenericModal("Access Denied", "You do not have permission to delete users.", [{ text: "OK", className: "vault-btn primary" }]);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        showGenericModal("Success", "User deleted successfully.", [{ text: "OK", className: "vault-btn primary" }]);
        fetchAllUsers(); // Refresh user list
    } catch (error) {
        console.error('Error deleting user:', error);
        showGenericModal("Error", `Failed to delete user: ${error.message}`, [{ text: "OK", className: "vault-btn primary" }]);
    }
};

// Fetches all tasks for admin view (global tasks)
const fetchAllTasksForAdmin = async () => {
    const token = localStorage.getItem('userToken');
    if (!token || currentUserRole !== 'admin') {
        console.warn('Not authorized to fetch all tasks for admin.');
        if (adminAllTasksList) adminAllTasksList.innerHTML = '<p class="placeholder-text">Access Denied: Admin privileges required.</p>';
        return;
    }

    if (adminAllTasksList) adminAllTasksList.innerHTML = '<p class="placeholder-text">Loading all tasks...</p>'; // Show loading indicator

    try {
        const response = await fetch(`${API_BASE_URL}/admin/tasks`, { // Assuming a new admin endpoint for all tasks
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                showGenericModal("Access Denied", "You do not have permission to view all tasks.", [{ text: "OK", className: "vault-btn primary" }]);
                if (adminAllTasksList) adminAllTasksList.innerHTML = '<p class="placeholder-text">Access Denied: Admin privileges required.</p>';
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const tasks = await response.json();
        renderAllTasksForAdmin(tasks);
    } catch (error) {
        console.error('Error fetching all tasks for admin:', error);
        if (adminAllTasksList) adminAllTasksList.innerHTML = '<p class="placeholder-text">Failed to load all tasks.</p>';
    }
};

// Renders all tasks in the admin all tasks list
const renderAllTasksForAdmin = (tasks) => {
    if (!adminAllTasksList) return;
    adminAllTasksList.innerHTML = ''; // Clear existing list
    if (tasks.length === 0) {
        adminAllTasksList.innerHTML = '<p class="placeholder-text">No tasks found in the system.</p>';
        return;
    }

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card priority-${task.priority.toLowerCase()}`;
        taskCard.id = `admin-task-${task._id}`; 
        
        const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Due Date';

        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>Status: ${task.status}</p>
            <p>Priority: ${task.priority}</p>
            <p>Due: ${dueDate}</p>
            <p>Created by: ${task.userEmail || 'N/A'}</p> <div class="task-actions">
                <button class="delete-admin-task-btn" data-task-id="${task._id}" title="Delete Task">×</button>
                </div>
        `;
        adminAllTasksList.appendChild(taskCard);
    });

    // Add event listeners for delete admin task buttons
    adminAllTasksList.querySelectorAll('.delete-admin-task-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskIdToDelete = e.target.dataset.taskId;
            showGenericModal(
                "Confirm Task Deletion (Admin)",
                `Are you sure you want to delete this task (ID: ${taskIdToDelete})? This will delete it for all users.`,
                [
                    { text: "Delete Task", className: "vault-btn primary", onClick: () => deleteAdminTask(taskIdToDelete) },
                    { text: "Cancel", className: "vault-btn secondary" }
                ]
            );
        });
    });
};

// Deletes any task (admin action)
const deleteAdminTask = async (taskId) => {
    const token = localStorage.getItem('userToken');
    if (!token || currentUserRole !== 'admin') {
        showGenericModal("Access Denied", "You do not have permission to delete tasks globally.", [{ text: "OK", className: "vault-btn primary" }]);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/tasks/${taskId}`, { // Assuming a new admin endpoint for global task deletion
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        showGenericModal("Success", "Task deleted successfully from all users.", [{ text: "OK", className: "vault-btn primary" }]);
        fetchAllTasksForAdmin(); // Refresh all tasks list
    } catch (error) {
        console.error('Error deleting admin task:', error);
        showGenericModal("Error", `Failed to delete task: ${error.message}`, [{ text: "OK", className: "vault-btn primary" }]);
    }
};

// --- Profile Form & Data Logic ---

// Function to fetch and display user data
const fetchUserProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            // userEmailDisplay.textContent = user.email; // Display user's email in the header
            updateUserProfileUI(user);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};

// Populate the profile form with user data
function updateUserProfileUI(user) {
    if (profileEmailInput) profileEmailInput.value = user.email;
    if (profileNameInput) profileNameInput.value = user.name || ''; // Use user's name if available, otherwise empty string
}

// Event listener for the Profile link
if (profileLink) {
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (userDropdownMenu) userDropdownMenu.classList.add('hidden'); // Hide the dropdown
        if (userMenuButton) userMenuButton.classList.remove('active'); // Remove active class from button
        showPage('profile-page', 'profile-link'); // Show the profile page
    });
}

// Update sign out logic to use the new dropdown link
if (signoutLink) {
    signoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userToken');
        showLogin();
        // userEmailDisplay.textContent = ''; // Clear the user email display in the header on signout
    });
}

// --- Profile Form Submission Logic ---
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (profileMessage) {
            profileMessage.textContent = 'Saving changes...';
            profileMessage.className = 'message';
        }

        const token = localStorage.getItem('userToken');
        const name = profileNameInput.value;
        const password = profilePasswordInput.value;

        const body = { name };
        if (password) {
            body.password = password;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                if (profileMessage) {
                    profileMessage.textContent = data.message || 'Profile updated successfully!';
                    profileMessage.className = 'message success';
                }
                if (profilePasswordInput) profilePasswordInput.value = ''; // Clear password field
                
                // Re-fetch profile to ensure UI is updated with new data
                fetchUserProfile();

            } else {
                if (profileMessage) {
                    profileMessage.textContent = data.error || 'Failed to update profile.';
                    profileMessage.className = 'message error';
                }
            }
        } catch (error) {
            console.error('Profile update fetch error:', error);
            if (profileMessage) {
                profileMessage.textContent = 'An error occurred. Please try again.';
                profileMessage.className = 'message error';
            }
        }
    });
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();
    checkAuthStatus(); // Check authentication state on page load

    // Add the event listener for the unlock button
    if (unlockButton) {
        unlockButton.addEventListener('click', () => {
            if (loginWindow) loginWindow.classList.add('expanded');
            if (loginFormWrapper) loginFormWrapper.classList.remove('collapsed');
        });
    }

    // Add event listener for the user menu button on the dashboard
    if (userMenuButton) {
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents the document click from immediately closing it
            if (userDropdownMenu) userDropdownMenu.classList.toggle('hidden');
        });
    }

    // Close the user dropdown if the user clicks anywhere else
    document.addEventListener('click', (e) => {
        if (userMenuButton && userDropdownMenu && !userMenuButton.contains(e.target) && !userDropdownMenu.contains(e.target)) {
            userDropdownMenu.classList.add('hidden');
        }
    });

    // Disable dates before the current day in the task due date calendar
    const today = new Date().toISOString().split('T')[0];
    const dueDateInput = document.getElementById('task-due-date');
    if (dueDateInput) {
        dueDateInput.setAttribute('min', today);
    }

    // =======================================================
    // === NEW: FILE STORAGE NAVIGATION LOGIC ===
    // =======================================================

    if (fileStorageLink) {
        fileStorageLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Show the file storage page and mark the link as active
            showPage('file-storage-page', 'file-storage-link'); 
            // Render the file list when the page is opened
            renderStoredFiles();
        });
    }

    // =======================================================
    // === NEW: FILE UPLOAD (DRAG & DROP) LOGIC ===
    // =======================================================

    // --- Helper Functions for Drag & Drop ---
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // --- 4. Main File Handling Function (Updated to trigger simulation) ---
    function handleFiles(files) {
        if (files.length === 0) return;

        if (fileListDisplay) fileListDisplay.innerHTML = ''; // Clear previous list
        
        // Simple display of selected files (temporarily lists them)
        const ul = document.createElement('ul');
        ul.style.listStyle = 'disc';
        ul.style.paddingLeft = '20px';

        Array.from(files).forEach(file => {
            // Placeholder: Show file name and size
            const li = document.createElement('li');
            li.textContent = `• ${file.name} (${(file.size / 1024).toFixed(2)} KB) - Ready to Upload`;
            ul.appendChild(li);
        });

        if (fileListDisplay) fileListDisplay.appendChild(ul);
        console.log("Files ready to upload:", files);

        // *** THIS IS THE KEY CHANGE: START THE SIMULATED UPLOAD ***
        simulateFileUpload(files);
    }

    // --- 1. Button Click to Trigger File Input ---
    if (triggerUploadBtn && fileUploadInput) {
        triggerUploadBtn.addEventListener('click', () => {
            fileUploadInput.click();
        });
    }

    // --- 2. Handle File Selection ---
    if (fileUploadInput) {
        fileUploadInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
            // Note: input clearing is moved inside simulateFileUpload for better control
        });
    }

    // --- 3. Drag and Drop Handlers ---
    if (dropZone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop zone on drag enter/over
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('highlight'), false);
        });
        
        // Unhighlight drop zone on drag leave/drop
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('highlight'), false);
        });

        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);
    }
});
