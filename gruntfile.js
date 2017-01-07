// npm i -g grunt

module.exports = function (grunt) {
	grunt.initConfig({
		ts: {
			"default": {
				files: [
					{
						src: ["src/**/*.ts"],
						dest: "build"
					}
				]
			},
			options: {
				"module": "commonjs",
				comments: false,
				target: "es6",
				declaration: false,
				sourceMap: false
			}
		}
	});

	
	grunt.loadNpmTasks("grunt-ts"); // https://www.npmjs.com/package/grunt-ts

	grunt.registerTask("default", ["ts"]);
};