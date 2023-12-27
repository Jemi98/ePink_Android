var listofcategories;
var firstcategory;
function initiateProductPoster(){
	
	if(authUser.pharma_categories != ""){
		var i;
		var postCat = JSON.parse(authUser.pharma_categories);
		var select = document.getElementById('product_category');
		var option;
		document.getElementById("productcategorysorter").innerHTML = '';
		option = document.createElement('option');
		option.setAttribute('value', '');
		option.appendChild(document.createTextNode('Please select a category'));
		select.appendChild(option);
		console.log(postCat);
		for (i = 0; i < postCat.length; i++) {
			firstcategory = postCat[0].name;
			var cate = postCat[i].name;
			var cate = cate.replace(/\s+/g, '-').toLowerCase();
			document.getElementById("productcategorysorter").innerHTML +='<p class="strong pink-text">'+postCat[i].name+'</p><ul class="collection" id="cat'+cate+'"></ul>';
			option = document.createElement('option');
			option.setAttribute('value', postCat[i].name);
			option.appendChild(document.createTextNode(postCat[i].name));
			select.appendChild(option);
		}
		//document.getElementById("product_category").innerHTML = '';
	}
	
}
var subcategorytoeditaid = 0;
function openSubcategory(maincategory){
	subcategorytoeditaid = maincategory;
	let subcattoUpdate = listofcategories[maincategory];
	if(listofcategories[maincategory].sub === undefined){
		subcategory = new Array;
		listofcategories[maincategory].sub = subcategory;
	}
	var toupate = listofcategories[maincategory].sub;
	document.getElementById("submanagertitle").innerHTML = listofcategories[maincategory].name;
	document.getElementById("submanagertitlecontent").innerHTML = listofcategories[maincategory].name;
	if(toupate.length == 0){
		document.getElementById("subcategorylist").innerHTML = '<li class="collection-item">This category has no sub category</li>';
	}else{
		console.log(toupate);
		document.getElementById("subcategorylist").innerHTML = '';
		for (let i = 0; i < toupate.length; i++) {
			document.getElementById("subcategorylist").innerHTML += '<li class="collection-item">'+toupate[i].name+'<i class="material-icons right pink-text" onclick="deleteSubcategory('+i+')">close</i></li>';
		}
	}
	show("subcategorymanager");
}
function deleteSubcategory(todelete){
	var currentlyviewingcategoryid = subcategorytoeditaid;
	var pickedcategorysubs = listofcategories[currentlyviewingcategoryid].sub;
	pickedcategorysubs.splice(todelete, 1);
	listofcategories[currentlyviewingcategoryid].sub = pickedcategorysubs;
	updateCategoryData();
		hide('subcategorymanager');
	hide('addsubcategory');
	openSubcategory(subcategorytoeditaid);
	authUser.pharma_categories = JSON.stringify(listofcategories);
}
function initCategorylist(){
	document.getElementById("listofcategory").innerHTML  = "";
	console.log(authUser.pharma_categories);
	if(authUser.pharma_categories == ""){
		show('addcategory');
	}else{
		listofcategories = JSON.parse(authUser.pharma_categories);
		console.log(listofcategories);
		var i;
		for (i = 0; i < listofcategories.length; i++) {
		  document.getElementById("listofcategory").innerHTML += '<li class="collection-item"><span onclick="openSubcategory('+i+')">'+listofcategories[i].name+'</span> <a href="#!" onclick="removeCategory('+i+', \''+listofcategories[i].name+'\')" class="right pink-text"><i class="material-icons strong">close</i></a> <a href="#!" onclick="openSubcategory('+i+')" class="right pink-text" style="padding-right: 10px"><i class="material-icons">settings</i></a></li>';
		  
		}
	}
}

function cleanUzl(val){
	var toclean = val;
	return toclean;
}

function addSubCategory(){
	var subtoadd = cleanUzl(document.getElementById("addsubcatval").value);
	console.log(subtoadd);
	var preparesub = {"name":subtoadd};
	var currentSubtoadd = listofcategories[subcategorytoeditaid].sub;
	currentSubtoadd.push(preparesub);
	console.log(currentSubtoadd);
	listofcategories[subcategorytoeditaid].sub = currentSubtoadd;
	
	
	authUser.pharma_categories = JSON.stringify(listofcategories);
	updateCategoryData("add");
	hide('subcategorymanager');
	hide('addsubcategory');
	openSubcategory(subcategorytoeditaid);
}
function removeCategory(id, name){
	console.log(id);
	console.log(listofcategories);
	listofcategories.splice(id, 1);
	authUser.pharma_categories = JSON.stringify(listofcategories);
	
	updateCategoryData("remove", name);
	initCategorylist();
	
}

function addCategory(){
	showLoading();
	var exist = false;
	var toAdd = document.getElementById("addcat").value;
	if(authUser.pharma_categories == ""){
		var newCategory = {"name":toAdd, "sub":[{"name":"Add sub category"}]};
		var newCom = [];
		newCom.push(newCategory);
		authUser.pharma_categories = JSON.stringify(newCom);
		updateCategoryData("add", toAdd);
		initCategorylist();
		hide("addcategory");
		closeLoading();
	}else{
		listofcategories = JSON.parse(authUser.pharma_categories);
		var i;
		for (i = 0; i < listofcategories.length; i++) {
		  if(listofcategories[i].name == toAdd){
			  exist = true;
		  }
		}
		if(exist == false){	
			listofcategories.push({ name: toAdd });
			authUser.pharma_categories = JSON.stringify(listofcategories);
			hide("addcategory");
			initCategorylist();
			updateCategoryData("add");
		}else{
			alert("This category already existed");
		}
		closeLoading();
	}
	
}

function updateCategoryData(ops, nameavailable){
		showLoading();
		authUser.pharma_categories = JSON.stringify(listofcategories)
		var dataTopost = 'api=1&auth_token='+authUser.login_token+"&updatecategory="+authUser.pharma_categories+"&type="+ops+"&nameavailable="+nameavailable;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				if(response.status == "fail"){
					alert(response.message);
					location.reload();
				}else{
					closeLoading();
				}
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}