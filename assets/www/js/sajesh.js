var app = {
	service_url : '',
	initialize : function(site_url){//initialize the application
		this.service_url = site_url+'/pservice/index.php';
		this.bindEvents();
	},
	
	bindEvents : function(){//bind events for application (deviceready or document load)
		var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
		if ( app ) {
		    document.addEventListener("deviceready", this.deviceReady);
		} else {
		    $(window).load(this.deviceReady);//call deviceReady function when page loads completely
		}
	},
	
	deviceReady : function(){
		propertyMatket.initialize();
	}
};

var ajaxCalls = {
	initialize : function(call){
 		var temporaryFunction = new Function(call);
		temporaryFunction();
	},
	
	makeCall : function(url, type, param, loader){
		var ajaxResponse;
		
		if(loader){
			$.mobile.loading( "show", {text: "Loading...", textVisible: true, theme : 'z'});
		}
		
		$.ajax({
   			async: false, 
			url : url, 
			type : type, 
			data : param,
			success : function(data){
				ajaxResponse = data;
				$.mobile.loading( "hide" );
			},
			error : function(data){
				alert("No Internet connection available, Please try again later");
				$.mobile.loading( "hide" );
			}
		});
		
		return ajaxResponse;
	}
};

var propertyMatket = {
	initialize : function(){
		this.listCategory();
	},
	listCategory : function(){
		var categoryList = ajaxCalls.makeCall(app.service_url, 'get', 'method=property-category', false);
		
		$.each(categoryList, function(key, value){
			var home = '<input type="checkbox" name="pcategory[]" id="'+value.propertyCategoryID+'" value="'+value.propertyCategoryID+'">'+
					   '<label for="'+value.propertyCategoryID+'">'+value.categoryName+'</label>';
					   
			$("#propertyCategory .ui-controlgroup-controls ").append(home).trigger("create");
		});
		
	}
};
