const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');

/**
 * dashboard routes
 */
router.get('/dashboard',isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/item/:id',isLoggedIn, dashboardController.dashboardViewNote);
router.put('/dashboard/item/:id',isLoggedIn, dashboardController.dashboardUpdateNote);
router.delete('/dashboard/item-delete/:id',isLoggedIn, dashboardController.dashboardDeleteNote);
router.post('/dashboard/summarize', dashboardController.dashboardSummarizeNote);
router.get('/dashboard/add',isLoggedIn, dashboardController.dashboardAddNote);
router.post('/dashboard/add',isLoggedIn, dashboardController.dashboardAddNote);
router.get('/dashboard/search',isLoggedIn, dashboardController.dashboardSearch);
router.post('/dashboard/search',isLoggedIn, dashboardController.dashboardSearchSubmit);

// EXPORT FEATURE: Route to export all notes for the current user
router.get('/dashboard/export',isLoggedIn, dashboardController.dashboardExport);

// EXPORT FEATURE: Route to export individual note by ID
router.get('/dashboard/export/:id',isLoggedIn, dashboardController.dashboardExportNote);

module.exports = router;