var site_url = "http://192.168.1.10";
//var site_url = "http://k9nepal.com/npmarket";
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var upload_property_filename;

function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}

function onBackKeyDown(e) {
    //navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No");
	var sPath=window.location.pathname;
	var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
	if(sPage == "index.html"){
		e.preventDefault();
		navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No");
	}else{
		navigator.app.backHistory();
	}
}
    
function onConfirm(button) {
    if(button==2){//If User selected No, then we just do nothing
        return;
    }else{
		localStorage.removeItem('upload_property_filename');
        navigator.app.exitApp();// Otherwise we quit the app.
    }    
}

function alertDismissed() {
    navigator.app.exitApp();
}

function onDeviceReady () {
	if(localStorage.getItem('logged_in') == 'true'){
		$("#welcome-msg").html("<a href='#'>Welcome "+localStorage.getItem('name')+"</a>");
		$("<li data-icon='false' id='my_profile'><a href='#my_profile_page'><i class='lIcon fa fa-heart'></i>My Profile</a></li><li data-icon='false'><a href='#' id='logout'><i class='lIcon fa fa-power-off'></i>Logout</a></li>").insertAfter("#settings");
		$("#main-menu").listview('refresh');
	}
//part0 - page initialization code
		
	$.mobile.touchOverflowEnabled = true;
	$("#mortgage_calc_page").load("mortgage.html");
	$("#mortgage_result_page").load("mortgage_result.html");
	$("#camera_page").load("camera.html");
	$("#feedback_page").load("feedback.html");
	$("#feedback_edit_page").load("feedback_edit.html");
	$("#my_profile_page").load("my_profile.html");
	$("#property_listing_page").load("property_listing.html");
	$("#upload_property_page").load("upload_property.html");
	
	var device_width = parseFloat($(window).width())- 40;
	$(".property_type .ui-controlgroup-controls").css("width",device_width + "px");
	
	$("body").on("click", ".checkLogin", function(e){
		e.preventDefault();
		if(localStorage.getItem('logged_in') != 'true' && jQuery.isEmptyObject(localStorage.getItem('user_id')) && jQuery.isEmptyObject(localStorage.getItem('name'))){
			alert("You must login to continue!");
			window.location.href = "index.html";
		}else{
			window.location.href = "#"+$(this).attr("load-page");
		}
	});
//end of part0
	
//part1 - code to change range slider value to lakh
	//buy range slider
	$( ".buy_range_left" ).on( 'change', function( event ) { 
		var num = $( ".buy_range_left" ).val();
		if( num >= 10000000){
			var num2 = num/10000000;
			$( "#buy_rval1" ).html(num2+' Crore');
		}else{
			var num2 = num/100000;
			$( "#buy_rval1" ).html(num2+' Lakh');
		}
	});
	$( ".buy_range_right" ).on( 'change', function( event ) { 
		var num = $( ".buy_range_right" ).val();
		if( num >= 10000000){
			var num2 = num/10000000;
			$( "#buy_rval2" ).html(num2+' Crore');
		}else{
			var num2 = num/100000;
			$( "#buy_rval2" ).html(num2+' Lakh');
		}
	});
	
	//rent range slider
	$( ".rent_range_left" ).on( 'change', function( event ) { 
		var num = $( ".rent_range_left" ).val();
		if( num >= 100000){
			var num2 = num/100000;
			$( "#rent_rval1" ).html(num2+' Lakh');
		}else{
			$( "#rent_rval1" ).html(num);
		}
	});
	$( ".rent_range_right" ).on( 'change', function( event ) { 
		var num = $( ".rent_range_right" ).val();
		if( num >= 100000){
			var num2 = num/100000;
			$( "#rent_rval2" ).html(num2+' Lakh');
		}else{
			$( "#rent_rval2" ).html(num);
		}
	});
//end of part1
	
//part2 - tabs search form submit function
	//buy tab
	$("#sale_frm").on("submit",function(e){
		e.preventDefault();
			$.mobile.loading( 'show', {
			text: 'Searching..',
			textVisible: true,
			theme: 'b',
			html: ""
		});
		var atLeastOneIsChecked = $('input[name="buypcategory[]"]:checked').length > 0;
		if(atLeastOneIsChecked){
			var postData = $(this).serialize();
			var url = site_url+"/pservice/index.php?method=property-sale";
				$.ajax({
					url : url,
					type: "GET",
					data : postData,
					success:function(data, textStatus, jqXHR)
					{
						loadPropertyList(data);
					},
					error: function(jqXHR, textStatus, errorThrown)
					{
						//if fails 
					}
				});
		}else{
			alert("Please select at least one category");
			$.mobile.loading('hide');
		}
	});
	
	//rent tab
	$("#rent_frm").on("submit",function(e){
		e.preventDefault();
		$.mobile.loading( 'show', {
			text: 'Searching...',
			textVisible: true,
			theme: 'b',
			html: ""
		});
		var atLeastOneIsChecked = $('input[name="rentpcategory[]"]:checked').length > 0;
		if(atLeastOneIsChecked){
			var postData = $(this).serialize();
			var url = site_url+"/pservice/index.php?method=property-rent";
				$.ajax({
					url : url,
					type: "GET",
					data : postData,
					success:function(data, textStatus, jqXHR)
					{
						loadPropertyList(data);
					},
					error: function(jqXHR, textStatus, errorThrown)
					{
						//if fails 
					}
				});
		}else{
			alert("Please select at least one category");
			$.mobile.loading('hide');
		}
	});
	
	function loadPropertyList(data){
		var listdata = data;
		var item  = "<li data-role='list-divider'>Property Available</li>";
		$.each( listdata, function( index, value ){
			item += "<li class='ui-li-has-thumb'><a href='#property_detail_page' class='ui-btn li-property-list' id='"+value.propertyID+"'>"+
	                "<img src='"+site_url+'/'+value.featuredImage+"'>"+
	                "<h2>"+value.bedrooms+" Bedroom</h2>"+
	                "<p>"+value.propertyArea+" "+value.areaUnit+"</p></a>"+
	                "<p class='ui-li-aside'><strong>Rs."+value.price+"</strong><br/><strong>Contact: "+value.name+"</strong><br/><a href='tel:"+value.contact+"'><strong>Mob: "+value.contact+"</strong></a></p></li>";
		});
		$("#propertylist").html(item);
		setTimeout(function(){$.mobile.changePage('#searchlist_page', { transition: "slide"});},300);
	}
//end of part2
	
//part3 - mortgage calculator code
	$("body").on("tap", "#mrt_btn",function(){
		var loan_amount = $("#loan_amount").val();
		var interest_rate = $("#interest_rate").val();
		var length_of_mortgage = $("#length_of_mortgage").val();
		var loan_period = $("#length_of_mortgage").val();
		if(loan_amount == "" || interest_rate == "" || length_of_mortgage == ""){
			// do nothing
		}else{
			loan_amount = parseFloat(loan_amount);
			interest_rate = parseFloat(interest_rate)/100;
			length_of_mortgage = parseInt(length_of_mortgage)*12;
			var monthly_interest_rate = interest_rate/12;
			
			// REFERENCE: P = L[c(1 + c)n]/[(1 + c)n - 1]
			var top_val = monthly_interest_rate * Math.pow((1+monthly_interest_rate),length_of_mortgage);
			var bot_val = Math.pow((1 + monthly_interest_rate),(length_of_mortgage))-1;
			var monthly_mortgage = parseFloat(loan_amount*(top_val/bot_val)).toFixed(2);
			
			var total_int = calculate_total_interest(loan_amount, monthly_mortgage, monthly_interest_rate, length_of_mortgage);
			
			$("body #loan_value").html(loan_amount);
			$("body #monthly_value").html(monthly_mortgage);
			$("body #interest_value").html(total_int);
			$("body #loan_period").html(loan_period);
			setTimeout(function(){$.mobile.changePage('#mortgage_result_page', { transition: "slide"});},300);
		}
		
		$("body").on("tap","#mresult_close", function(){
			$("body #mrt_calculator").trigger("reset");
		});
	});
	
	function calculate_total_interest(loan_amount, monthly_mortgage, monthly_interest_rate, length_of_mortgage) {
		var total_mortgage = parseFloat(0);
		var total_principal = parseFloat(0);
		var total_interest = parseFloat(0);
		
		for(i=length_of_mortgage; i>0; i--) {
			var monthly_interest = parseFloat(loan_amount * monthly_interest_rate).toFixed(2);
			var monthly_principal = parseFloat(monthly_mortgage - monthly_interest).toFixed(2);
			total_interest = parseFloat(total_interest) + parseFloat(monthly_interest);
			loan_amount = parseFloat(loan_amount - monthly_principal).toFixed(2);
			
			};
		
		return total_interest.toFixed(2);
	}
	
//end of part3
	
//part4 - using camera and uploading images
	$("body").on("tap","#camera_btn",capturePhoto );
	$("body").on("tap","#select_photo_btn",selectPhoto );
	
	function clearCache() {
		navigator.camera.cleanup();
	}
	 
	var retries = 0;
	
	function onCapturePhoto(fileURI) {
		var win = function (r) {
			clearCache();
			retries = 0;
			var uploaded_file = $.parseJSON(r.response);
			if(jQuery.isEmptyObject(localStorage.getItem('upload_property_filename'))){
				upload_property_filename = [];
			}else{
				upload_property_filename = $.parseJSON(localStorage.getItem('upload_property_filename'));
			}
			upload_property_filename.push(uploaded_file.filename);
			localStorage.setItem('upload_property_filename', JSON.stringify(upload_property_filename));
			$.mobile.loading('hide');
			alert('Done!');
		}
	 
		var fail = function (error) {
			if (retries == 0) {
				retries ++
				setTimeout(function() {
					onCapturePhoto(fileURI)
				}, 1000)
			} else {
				retries = 0;
				clearCache();
				$.mobile.loading('hide');
				alert('Ups. Something wrong happens!');
			}
		}
	 
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";
		options.params = {}; // if we need to send parameters to the server request
		var ft = new FileTransfer();
		$.mobile.loading('show', {
			text: 'Uploading...',
			textVisible: true,
			theme: 'b',
			html: ""
		});
		ft.upload(fileURI, encodeURI(site_url+"/pservice/upload.php"), win, fail, options);
	}
	 
	function capturePhoto() {
		navigator.camera.getPicture(onCapturePhoto, onFail, {
			quality: 70,
			destinationType: destinationType.FILE_URI
		});
	}
	
	function selectPhoto(){
		navigator.camera.getPicture(onCapturePhoto, onFail, {
			quality: 70,
			sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: destinationType.FILE_URI
		});
	}
	 
	function onFail(message) {
		alert('Failed because: ' + message);
	}
	
//end of part4
	
//part5- feedback list
	$("body").on("tap","#feedback_btn", function(){
		var postData = $("#feedback_frm").serialize();
		var url = site_url+"/pservice/index.php?method=feedback-add";
		$.ajax({
			url : url,
			type: "GET",
			data : postData,
			success:function(data, textStatus, jqXHR)
			{
				$("#load_feedback").click();
				$("body #feedback_frm").trigger("reset");
				alert("Feedback Added");
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	});
	
	$("#load_feedback").on("click",function(){
		var url = site_url+"/pservice/index.php?method=feedback-list";
		$.ajax({
			url : url,
			type: "GET",
			success:function(data, textStatus, jqXHR)
			{
				loadFeedback(data);
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	});
	
	function loadFeedback(data){
		var listdata = data;
		var item  = "<li data-role='list-divider'>Feedback Lists</li>";
		$.each( listdata, function( index, value ){
		item += "<li class='ui-li-has-thumb'>"+
                "<h2>"+value.feedback_name+"</h2>"+
                "<p>"+value.feedback_content+"</p>"+
				"<p class='ui-li-aside'>"+
				"<a href='#feedback_edit_page' var='"+value.id+
				"' id='feedback_edit'><i class='lIcon fa fa-pencil fa-3x'></i></a>"+
				"<a href='#' var='"+value.id+
				"' id='feedback_delete'><i class='lIcon fa fa-trash fa-3x'></i></a>"+
                "</p></li>";
	
		});
		$("#feedbacklist").html(item);
	}
	
	$("body").on("tap","#feedback_delete", function(){
		var id = $(this).attr('var');
		var url = site_url+"/pservice/index.php?method=feedback-remove&delid="+id;
		$.ajax({
			url : url,
			type: "GET",
			success:function(data, textStatus, jqXHR)
			{
				alert("Feedback deleted");
				$("#load_feedback").click();
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		
		});
	});
	
	$("body").on("tap","#feedback_edit", function(){
		var id = $(this).attr('var');
		var url = site_url+"/pservice/index.php?method=feedback-single&id="+id;
		$.ajax({
			url : url,
			type: "GET",
			success:function(data, textStatus, jqXHR)
			{
				$.each(data, function( index, value11 ){
				$("#feedback_edit_name").val(value11.feedback_name);
				$("#feedback_edit_content").val(value11.feedback_content);
				$("#feedback_edit_id").val(value11.id);
				});
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	});	
	
	$("body").on("tap","#feedback_edit_btn", function(){
		var postData = $("#feedback_edit_frm").serialize();
		var url = site_url+"/pservice/index.php?method=feedback-update";
		$.ajax({
			url : url,
			type: "GET",
			data : postData,
			success:function(data, textStatus, jqXHR)
			{
				$("#load_feedback").click();
				$("body #feedback_frm").trigger("reset");
				alert("Feedback Updated");
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	});

//end of part5
	
//part6 - login, logout and forget password
	$("#login_frm").on("submit", function(e){
		e.preventDefault();
		$.mobile.loading( 'show', {
		text: 'Loading...',
		textVisible: true,
		theme: 'b',
		html: ""
		});
		var postData = $("#login_frm").serialize();
		var url = site_url+"/pservice/index.php?method=user-login";
		$.ajax({
			url : url,
			type: "POST",
			data : postData,
			success:function(data, textStatus, jqXHR)
			{
				if(data.response == 'success'){
					localStorage.setItem('logged_in','true');
					localStorage.setItem('user_id', data.userdata['userID']);
					localStorage.setItem('user_type_id', data.userdata['userType']);
					localStorage.setItem('name', data.userdata['name']);
					window.location.href = 'home.html';
				}else{
					$("#login-error").html("<li data-role='fieldcontain' class='txt-error'>"+data.response+"</li>");
					$("#login-error").listview('refresh');
				}
				$.mobile.loading( 'hide');
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				$.mobile.loading( 'hide');
			}
		});
	});
	
	$("body").on("tap", "#logout", function(){
		localStorage.clear();
		window.location.href = 'index.html';
	});
	
	$("#forget_pass_frm").on("submit", function(e){
		e.preventDefault();
		var postData = $(this).serialize();
		var url = site_url+"/pservice/index.php?method=user-forget-password";
		$.ajax({
			url : url,
			type: "POST",
			data : postData,
			success:function(data, textStatus, jqXHR)
			{
				if(data.response == 'success'){
					$("#login-error").html("<li data-role='fieldcontain' class='txt-success'>"+data.message+"</li>");
					$("#login-error").listview('refresh');
					window.location.href = "index.html";
				}else{
					$("#error-msg").html("<li data-role='fieldcontain' class='txt-error'>"+data.message+"</li>");
					$("#error-msg").listview('refresh');
				}
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails
			}
		});
	});
//end of part6	
	
//part7 - registration
	$("#register_frm").on("submit",function(e){
		e.preventDefault();
		$.mobile.loading( 'show', {
		text: 'Loading..',
		textVisible: true,
		theme: 'b',
		html: ""
		});
		var uuid = generateUUID();
		var postData = $(this).serialize()+'&uuid='+uuid;
		var url = site_url+"/pservice/index.php?method=user-registration";
		$.ajax({
			url : url,
			type: "POST",
			data : postData,
			success:function(data, textStatus, jqXHR)
			{
				if(data.response == 'success'){
					localStorage.setItem('logged_in','true');
					localStorage.setItem('user_id', data.userdata['userID']);
					localStorage.setItem('user_type_id', data.userdata['userType']);
					localStorage.setItem('name', data.userdata['name']);
					window.location.href = "home.html";
				}else{
					$("#register-error").html("<li data-role='fieldcontain' class='txt-error'>"+data.response+"</li>");
					$("#register-error").listview('refresh');
				}
				$.mobile.loading( 'hide');
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				$.mobile.loading( 'hide');
			}
		});
	});
	
	function generateUUID(){
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		return uuid;
	}
//end of part7
	
//part8 - my profile
	$("body").on("tap", "#change_pass_btn",  function(){
		var userId = localStorage.getItem('user_id');
		var postData = $("#change_pass_frm").serialize()+'&user_id='+userId;
		var url = site_url+"/pservice/index.php?method=user-change-password";
		console.log(postData);
		$.ajax({
			url : url,
			type: "POST",
			data: postData,
			success: function(data, textStatus, jqXHR)
			{
				if(data.response == 'success'){
					$("#error-msg").html("<li data-role='fieldcontain' class='txt-success'>Your password has been changed successfully.</li>");
					$("#error-msg").listview('refresh');
					$("body #change_pass_frm").trigger("reset");
				}else{
					$("#error-msg").html("<li data-role='fieldcontain' class='txt-error'>"+data.response+"</li>");
					$("#error-msg").listview('refresh');
				}
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				
			}
		});
	});
	
	$("body").on("tap", "#my_profile", function(){
		var id = localStorage.getItem('user_id');
		var url = site_url+"/pservice/index.php?method=get-profile-data&id="+id;
		$.ajax({
			url : url,
			type: "GET",
			success:function(data, textStatus, jqXHR)
			{
				if(data.response == 'success'){
					$.each(data, function( index, value ){
						$("#email").val(value.email);
						$("#contact").val(value.contact);
						$("#address").val(value.address);
						$("#dob").val(value.DOB);
					});
				}else{
					alert(data.response);
				}
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	});
	
	$("body").on("tap", "#my_detail_btn", function(){
		var id = localStorage.getItem('user_id');
		var postData = $("#my_detail_frm").serialize()+"&id="+id;
		var url = site_url+'/pservice/index.php?method=update-profile';
		$.ajax({
			url: url,
			type: "POST",
			data: postData,
			success: function(data, textStatus, jqXHR)
			{
				if(data.response == 'success'){
					$("#error-msg").html("<li data-role='fieldcontain' class='txt-success'>Your profile has been updated successfully.</li>");
					$("#error-msg").listview('refresh');
				}
				if(data.response == 'fail'){
					$("#error-msg").html("<li data-role='fieldcontain' class='txt-error'>Sorry your request could not be completed.</li>");
					$("#error-msg").listview('refresh');
				}
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	});
//end of part8
	
//part9 - upload property
	$("body").on("change", "#upload_property_frm #property_category", function(){
		switch($("#upload_property_frm #property_category").val()){
			case '1':
				$("#property_details").load("upload_property_house.html", function(){
					$("body #ul_property_details #user_id").val(localStorage.getItem('user_id'));
					$("body #ul_property_details #posted_by").val(localStorage.getItem('user_type_id'));
					$("body #property_details #ul_property_details").trigger("create");
				});
				break;
			case '2':
				$("#property_details").load("upload_property_apartment.html", function(){
					$("body #ul_property_details #user_id").val(localStorage.getItem('user_id'));
					$("body #ul_property_details #posted_by").val(localStorage.getItem('user_type_id'));
					$("body #property_details #ul_property_details").trigger("create");
				});
				break;
			case '3':
				$("#property_details").load("upload_property_land.html", function(){
					$("body #ul_property_details #user_id").val(localStorage.getItem('user_id'));
					$("body #property_details #ul_property_details").trigger("create");
				});
				break;
			case '4':
				$("#property_details").load("upload_property_farm_house.html", function(){
					$("body #ul_property_details #user_id").val(localStorage.getItem('user_id'));
					$("body #property_details #ul_property_details").trigger("create");
				});
				break;
			case '5':
				$("#property_details").load("upload_property_service_apartment.html", function(){
					$("body #ul_property_details #user_id").val(localStorage.getItem('user_id'));
					$("body #property_details #ul_property_details").trigger("create");
				});
				break;
			default:
				$("#ul_basic_information").listview("refresh");
		}
	});
	
	//upload property clicking next button
	$("body").on('click', '#upload_property_nxt_btn', function(){
		if($("#upload_property_frm #property_category").val() == '')
			alert("Please select property category");
		else
			$('body #upload_property_tabs').tabs('option', 'active', 1);
    });
	
	//upload property form submit
	$("body").on("tap", "#upload_property_btn", function(e){
		e.preventDefault();
		var url = site_url+"/pservice/index.php?method=upload-property";
		var postData = $("#upload_property_frm").serialize()+"&img="+localStorage.getItem('upload_property_filename');
		$.ajax({
			url: url,
			type: "POST",
			data: postData,
			success:function(data, textStatus, jqXHR)
			{
				if(data.response == 'success'){
					alert(data.message);
				}
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	});
//end of part9
	
//part10 - my property listing
	$("body").on("tap", "#my_property_listing", function(e){
		myPropertyListing(e);
	});
	
	function myPropertyListing(e){
		e.preventDefault();
		$.mobile.loading( 'show', {
		text: 'Loading...',
		textVisible: true,
		theme: 'b',
		html: ""
		});
		var url = site_url+"/pservice/index.php?method=my-property-listing";
		var id = localStorage.getItem('user_id');
		var postData = "id="+id;
		$.ajax({
			url : url,
			type: "GET",
			data: postData,
			success:function(data, textStatus, jqXHR)
			{
				loadMyPropertyList(data);
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		
		});
	}
	
	function loadMyPropertyList(data){
	var listdata = data;
	var item  = "<li data-role='list-divider'>Property Available</li>";
	$.each( listdata, function( index, value ){
	item += "<li class='ui-li-has-thumb'><a href='#property_detail_page' id='"+value.propertyID+"' class='ui-btn li-property-list'>"+
                "<img src='"+site_url+'/'+value.featuredImage+"'>"+
                "<h2>"+value.bedrooms+" Bedroom</h2>"+
                "<p>"+value.propertyArea+" "+value.areaUnit+"</p>"+
                "<p>"+value.location+", "+value.districtName+"</p></a>"+
                "<p class='ui-li-aside'><strong>Rs."+value.price+"</strong><br/><br/><a href='#'><i class='fa fa-pencil-square-o'></i></a>&nbsp;<a href='#' class='my_property_list_delete' id='"+value.propertyID+"'><i class='fa fa-trash'></i></a></li>";
	
	});
	$("#propertylist").html(item);
	setTimeout(function(){$.mobile.changePage('#searchlist_page', { transition: "slide"});},300);
	
	}
	
	//clicking a property list
	$("body").on("tap", ".li-property-list", function(){
		var id = $(this).attr("id");
		var postData = "id="+id;
		var url = site_url+"/pservice/index.php?method=property-detail";
		$.ajax({
			url: url,
			type: "POST",
			data: postData,
			success:function(data, textStatus, jqXHR)
			{
				//console.log(data);
				loadPropertyDetail(data);
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails     
			}
		});
	});
	
	function loadPropertyDetail(data){
		var detailData = data.detail;
		var galleryData = data.gallery;
		switch(detailData.propertyCategory){
			case '1':
				$("#property_detail_page").load("property_detail.html", function(){
					var item  = "";
					$.each(galleryData, function(index, value){
						item += "<div><img u='image' src='"+site_url+"/"+value.imageLink+"'/></div>";
					});
					$("#slides_container").html(item, function(){
						$(".li_slider1_container").trigger("create");
					});
					loadSlider();
					$("#ul_property_detail").append('<li data-role="list-divider">Property Information</li>'+
						'<li id="detail-propertyType" class="li-property-detail"><strong>Type: </strong>House</li>'+
						'<li id="detail-price" class="li-property-detail"><strong>Price: </strong>'+detailData.price+'</li>'+
						'<li id="detail-refNumber" class="li-property-detail"><strong>Reference Number: </strong>'+detailData.refNumber+'</li>'+
						'<li id="detail-propertyArea" class="li-property-detail"><strong>Property Area: </strong>'+detailData.propertyArea+' '+detailData.areaUnit+'</li>'+
						'<li id="detail-bedroom" class="li-property-detail"><strong>Bedrooms: </strong>'+detailData.bedrooms+'</li>'+
						'<li id="detail-livingroom" class="li-property-detail"><strong>Living Rooms: </strong>'+detailData.livingroom+'</li>'+
						'<li id="detail-bathroom" class="li-property-detail"><strong>Bathrooms: </strong>'+detailData.bathroom+'</li>'+
						'<li id="detail-floor" class="li-property-detail"><strong>Total Floors: </strong>'+detailData.floor+'</li>'+
						'<li id="detail-furnished" class="li-property-detail"><strong>Furnished: </strong>'+detailData.furnished+'</li>'+
						'<li data-role="list-divider">Property Description</li>'+
						'<li id="detail-propertyDescription" class="li-property-detail">'+detailData.propertyDesc+'</li>'+
						'<li data-role="list-divider">Contact Information</li>'+
						'<li id="detail-contName" class="li-property-detail"><strong>Contact Person: </strong>'+detailData.name+'</li>'+
						'<li id="detail-contMobile" class="li-property-detail"><strong>Mobile Number: </strong>'+detailData.contact+'</li>'+
						'<li id="detail-contAddress" class="li-property-detail"><strong>Address: </strong>'+detailData.address+'</li>'+
						'<li id="detail-contEmail" class="li-property-detail"><strong>Email: </strong>'+detailData.email+'</li>');
					$("body #property_detail_page_inner").trigger("create");
										
					/*$("#detail-refNumber").html("<strong>Reference Number: </strong>"+detailData.refNumber);
					$("#detail-price").html("<strong>Price: </strong>"+detailData.price);
					$("#detail-propertyArea").html("<strong>Property Area: </strong>"+detailData.propertyArea+" "+detailData.areaUnit);
					$("#detail-bedroom").html("<strong>Bedrooms: </strong>"+detailData.bedrooms);
					$("#detail-livingroom").html("<strong>Living Rooms: </strong>"+detailData.livingroom);
					$("#detail-bathroom").html("<strong>Bathrooms: </strong>"+detailData.bathroom);
					$("#detail-floor").html("<strong>Total Floors: </strong>"+detailData.floor);
					$("#detail-furnished").html("<strong>Furnished: </strong>"+detailData.furnished);
					$("#detail-propertyDescription").html(detailData.propertyDesc);
					$("#detail-contName").html("<strong>Contact Person: </strong>"+detailData.name);
					$("#detail-contMobile").html("<strong>Mobile Number: </strong>"+detailData.contact);
					$("#detail-contAddress").html("<strong>Address: </strong>"+detailData.address);
					$("#detail-contEmail").html("<strong>Email: </strong>"+detailData.email);
					$("body #property_detail_page_inner").trigger("create");*/
				});
				break;
			case '2':
				$("#property_detail_page").load("property_detail.html", function(){
					var item  = "";
					$.each(galleryData, function(index, value){
						item += "<div><img u='image' src='"+site_url+"/"+value.imageLink+"'/></div>";
					});
					$("#slides_container").html(item, function(){
						$(this).trigger("create");
					});
					loadSlider();
					$("#ul_property_detail").append('<li data-role="list-divider">Property Information</li>'+
						'<li id="detail-propertyType"><strong>Type: </strong>Apartment</li>'+
						'<li id="detail-price"><strong>Price: </strong>'+detailData.price+'</li>'+
						'<li id="detail-refNumber"><strong>Reference Number: </strong>'+detailData.refNumber+'</li>'+
						'<li id="detail-propertyArea"><strong>Property Area: </strong>'+detailData.propertyArea+' '+detailData.areaUnit+'</li>'+
						'<li id="detail-bedroom"><strong>Bedrooms: </strong>'+detailData.bedrooms+'</li>'+
						'<li id="detail-livingroom"><strong>Living Rooms: </strong>'+detailData.livingroom+'</li>'+
						'<li id="detail-bathroom"><strong>Bathrooms: </strong>'+detailData.bathroom+'</li>'+
						'<li id="detail-floor"><strong>Total Floors: </strong>'+detailData.floor+'</li>'+
						'<li id="detail-furnished"><strong>Furnished: </strong>'+detailData.furnished+'</li>'+
						'<li data-role="list-divider">Property Description</li>'+
						'<li id="detail-propertyDescription">'+detailData.propertyDesc+'</li>'+
						'<li data-role="list-divider">Contact Information</li>'+
						'<li id="detail-contName"><strong>Contact Person: </strong>'+detailData.name+'</li>'+
						'<li id="detail-contMobile"><strong>Mobile Number: </strong>'+detailData.contact+'</li>'+
						'<li id="detail-contAddress"><strong>Address: </strong>'+detailData.address+'</li>'+
						'<li id="detail-contEmail"><strong>Email: </strong>'+detailData.email+'</li>');
					$("body #property_detail_page_inner").trigger("create");
				});
				break;
			case '3':
				$("#property_detail_page").load("property_detail.html", function(){
					var item  = "";
					$.each(galleryData, function(index, value){
						item += "<div><img u='image' src='"+site_url+"/"+value.imageLink+"'/></div>";
					});
					$("#slides_container").html(item, function(){
						$(this).trigger("create");
					});
					loadSlider();
					$("#ul_property_detail").append('<li data-role="list-divider">Property Information</li>'+
						'<li id="detail-propertyType"><strong>Type: </strong>Apartment</li>'+
						'<li id="detail-price"><strong>Price: </strong>'+detailData.price+'</li>'+
						'<li id="detail-refNumber"><strong>Reference Number: </strong>'+detailData.refNumber+'</li>'+
						'<li id="detail-propertyArea"><strong>Property Area: </strong>'+detailData.propertyArea+' '+detailData.areaUnit+'</li>'+
						'<li id="detail-roadAccess"><strong>Road Access: </strong>'+detailData.roadAccess+'</li>'+
						'<li data-role="list-divider">Property Description</li>'+
						'<li id="detail-propertyDescription">'+detailData.propertyDesc+'</li>'+
						'<li data-role="list-divider">Contact Information</li>'+
						'<li id="detail-contName"><strong>Contact Person: </strong>'+detailData.name+'</li>'+
						'<li id="detail-contMobile"><strong>Mobile Number: </strong>'+detailData.contact+'</li>'+
						'<li id="detail-contAddress"><strong>Address: </strong>'+detailData.address+'</li>'+
						'<li id="detail-contEmail"><strong>Email: </strong>'+detailData.email+'</li>');
					$("body #property_detail_page_inner").trigger("create");
				});
				break;
			case '4':
				$("#property_detail_page").load("property_detail.html", function(){
					var item  = "";
					$.each(galleryData, function(index, value){
						item += "<div><img u='image' src='"+site_url+"/"+value.imageLink+"'/></div>";
					});
					$("#slides_container").html(item, function(){
						$(this).trigger("create");
					});
					loadSlider();
					$("#ul_property_detail").append('<li data-role="list-divider">Property Information</li>'+
						'<li id="detail-propertyType"><strong>Type: </strong>Apartment</li>'+
						'<li id="detail-price"><strong>Price: </strong>'+detailData.price+'</li>'+
						'<li id="detail-refNumber"><strong>Reference Number: </strong>'+detailData.refNumber+'</li>'+
						'<li id="detail-propertyArea"><strong>Property Area: </strong>'+detailData.propertyArea+' '+detailData.areaUnit+'</li>'+
						'<li id="detail-floor"><strong>Total Floors: </strong>'+detailData.floor+'</li>'+
						'<li id="detail-roadAccess"><strong>Road Access: </strong>'+detailData.roadAccess+'</li>'+
						'<li data-role="list-divider">Property Description</li>'+
						'<li id="detail-propertyDescription">'+detailData.propertyDesc+'</li>'+
						'<li data-role="list-divider">Contact Information</li>'+
						'<li id="detail-contName"><strong>Contact Person: </strong>'+detailData.name+'</li>'+
						'<li id="detail-contMobile"><strong>Mobile Number: </strong>'+detailData.contact+'</li>'+
						'<li id="detail-contAddress"><strong>Address: </strong>'+detailData.address+'</li>'+
						'<li id="detail-contEmail"><strong>Email: </strong>'+detailData.email+'</li>');
					$("body #property_detail_page_inner").trigger("create");
				});
				break;
			case '5':
				$("#property_detail_page").load("property_detail.html", function(){
					var item  = "";
					$.each(galleryData, function(index, value){
						item += "<div><img u='image' src='"+site_url+"/"+value.imageLink+"'/></div>";
					});
					$("#slides_container").html(item, function(){
						$(this).trigger("create");
					});
					loadSlider();
					$("#ul_property_detail").append('<li data-role="list-divider">Property Information</li>'+
						'<li id="detail-propertyType"><strong>Type: </strong>Apartment</li>'+
						'<li id="detail-price"><strong>Price: </strong>'+detailData.price+'</li>'+
						'<li id="detail-refNumber"><strong>Reference Number: </strong>'+detailData.refNumber+'</li>'+
						'<li id="detail-propertyArea"><strong>Property Area: </strong>'+detailData.propertyArea+' '+detailData.areaUnit+'</li>'+
						'<li id="detail-bedroom"><strong>Bedrooms: </strong>'+detailData.bedrooms+'</li>'+
						'<li id="detail-livingroom"><strong>Living Rooms: </strong>'+detailData.livingroom+'</li>'+
						'<li id="detail-bathroom"><strong>Bathrooms: </strong>'+detailData.bathroom+'</li>'+
						'<li id="detail-floor"><strong>Total Floors: </strong>'+detailData.floor+'</li>'+
						'<li id="detail-furnished"><strong>Furnished: </strong>'+detailData.furnished+'</li>'+
						'<li data-role="list-divider">Property Description</li>'+
						'<li id="detail-propertyDescription">'+detailData.propertyDesc+'</li>'+
						'<li data-role="list-divider">Contact Information</li>'+
						'<li id="detail-contName"><strong>Contact Person: </strong>'+detailData.name+'</li>'+
						'<li id="detail-contMobile"><strong>Mobile Number: </strong>'+detailData.contact+'</li>'+
						'<li id="detail-contAddress"><strong>Address: </strong>'+detailData.address+'</li>'+
						'<li id="detail-contEmail"><strong>Email: </strong>'+detailData.email+'</li>');
					$("body #property_detail_page_inner").trigger("create");
				});
				break;
			default:
				alert("Cannot load details!");
		}
	}
	
	/*function loadSlider(){
		var options = {
			$AutoPlay: true,
			$AutoPlaySteps: 4,
			$AutoPlayInterval: 4000,
			$PauseOnHover: 1,
			$ArrowKeyNavigation: true,
			$SlideDuration: 160,    
			$MinDragOffsetToSlide: 20, 
			$SlideWidth: 200,
			//$SlideHeight: 150,
			$SlideSpacing: 3,
			$DisplayPieces: 4,
			$ParkingPosition: 0,
			$UISearchMode: 1,
			$PlayOrientation: 1,
			$DragOrientation: 1,
			$BulletNavigatorOptions: {
				$Class: $JssorBulletNavigator$,
				$ChanceToShow: 2,
				$AutoCenter: 0,
				$Steps: 1,
				$Lanes: 1,
				$SpacingX: 0, 
				$SpacingY: 0,
				$Orientation: 1 
			},
			$ArrowNavigatorOptions: {
				$Class: $JssorArrowNavigator$,
				$ChanceToShow: 1,
				$AutoCenter: 2,
				$Steps: 4
			}
		};

		var jssor_slider1 = new $JssorSlider$("slider1_container", options);
		
		function ScaleSlider() {
			var bodyWidth = document.body.clientWidth;
			if (bodyWidth)
				jssor_slider1.$ScaleWidth(Math.min(bodyWidth, 809));
			else
				window.setTimeout(ScaleSlider, 30);
		}

		ScaleSlider();

		if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
			$(window).bind('resize', ScaleSlider);
		}
	}*/
	function loadSlider(){
		var options = {
			$FillMode: 1,                                       //[Optional] The way to fill image in slide, 0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
			$AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
			$AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
			$PauseOnHover: 1,                                   //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

			$ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
			$SlideEasing: $JssorEasing$.$EaseOutQuint,          //[Optional] Specifies easing for right to left animation, default value is $JssorEasing$.$EaseOutQuad
			$SlideDuration: 800,                               //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
			$MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
			//$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
			//$SlideHeight: 300,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
			$SlideSpacing: 0, 					                //[Optional] Space between each slide in pixels, default value is 0
			$DisplayPieces: 1,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
			$ParkingPosition: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
			$UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
			$PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
			$DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

			$BulletNavigatorOptions: {                          //[Optional] Options to specify and enable navigator or not
				$Class: $JssorBulletNavigator$,                 //[Required] Class to create navigator instance
				$ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
				$AutoCenter: 1,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
				$Steps: 1,                                      //[Optional] Steps to go for each navigation request, default value is 1
				$Lanes: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
				$SpacingX: 8,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
				$SpacingY: 8,                                   //[Optional] Vertical space between each item in pixel, default value is 0
				$Orientation: 1                                 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
			},

			$ArrowNavigatorOptions: {                           //[Optional] Options to specify and enable arrow navigator or not
				$Class: $JssorArrowNavigator$,                  //[Requried] Class to create arrow navigator instance
				$ChanceToShow: 1,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
				$AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
				$Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
			}
		};

		var jssor_slider1 = new $JssorSlider$("slider1_container", options);

		//responsive code begin
		//you can remove responsive code if you don't want the slider scales while window resizes
		function ScaleSlider() {
			var bodyWidth = document.body.clientWidth;
			if (bodyWidth)
				jssor_slider1.$ScaleWidth(Math.min(bodyWidth, 1920));
			else
				window.setTimeout(ScaleSlider, 30);
		}

		ScaleSlider();

		if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
			$(window).bind('resize', ScaleSlider);
		}
	}
	
	//delete my property list
	$("body").on("tap", ".my_property_list_delete", function(e){
		e.preventDefault();
		if(confirm("Are you sure to delete?")){
			var id = $(this).attr("id");
			var postData = "id="+id+"&siteurl="+site_url;
			var url = site_url+"/pservice/index.php?method=property-delete";
			$.ajax({
				url: url,
				type: "POST",
				data: postData,
				success:function(data, textStatus, jqXHR)
				{
					if(data.response == 'success'){
						alert('Property deleted successfully');
						myPropertyListing(e);
						$.mobile.loading('hide');
					}else{
						alert(data.response);
					}
				},
				error: function(jqXHR, textStatus, errorThrown)
				{
					//if fails     
				}
			});
		}
	});
	//end of part10
	
	

}//main function terminator

//developer tab
	function loadDeveloperProperty(){
		$.mobile.loading( 'show', {
			text: 'Loading...',
			textVisible: true,
			theme: 'b',
			html: ""
		});
		var url = site_url+"/pservice/index.php?method=property-developer";
		$.ajax({
			url : url,
			type: "GET",
			success:function(data, textStatus, jqXHR)
			{
				var listdata = data;
				var item  = "<li data-role='list-divider'>Property Available</li>";
				$.each( listdata, function( index, value ){
				item += "<li class='ui-li-has-thumb'><a href='#property_detail_page' class='ui-btn li-property-list' id='"+value.propertyID+"'>"+
							"<img src='"+site_url+'/'+value.featuredImage+"'>"+
							"<h2>"+value.bedrooms+" Bedroom</h2>"+
							"<p>"+value.propertyArea+" "+value.areaUnit+"</p>"+
							"<p class='ui-li-aside'><strong>Rs."+value.price+"</strong><br/><strong>Contact: "+value.name+"</strong><br/><strong>Mob: "+value.contact+"</strong></p></a></li>";
				
				});
				$("#developerPropertyList").html(item);
				$("#developerPropertyList").listview("refresh");
				$.mobile.loading('hide');
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				//if fails 
			}
		});
	}