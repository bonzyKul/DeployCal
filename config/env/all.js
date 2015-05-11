'use strict';

module.exports = {
	app: {
		title: 'DeployCal',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
                'public/lib/angular-material/angular-material.css',
                'public/lib/angular-bootstrap-colorpicker/css/colorpicker.css',
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/fullcalendar/dist/fullcalendar.css',
                'public/lib/qtip2/jquery.qtip.css'

			],
			js: [
                'public/lib/jquery/dist/jquery.js',
                'public/lib/moment/moment.js',
				'public/lib/angular/angular.js',
                'public/lib/angular-aria/angular-aria.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js',
                'public/lib/tinycolor/tinycolor.js',
                'public/lib/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap.js',
                'public/lib/angular-material/angular-material.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/fullcalendar/dist/fullcalendar.js',
                'public/lib/qtip2/jquery.qtip.js'

			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
