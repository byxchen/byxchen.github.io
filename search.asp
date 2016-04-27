<!DOCTYPE html>
<html>
	<head>
		<title> RS Item Search</title>
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<!-- Latest compiled and minified JavaScript -->
		<script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="Scripts/bootstrap.min.js"></script>
		<link href = "rs-styles.css" rel="stylesheet" type="text/css"/>
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	</head>
	<body>
		<header>
			<nav class="navbar navbar-default navbar-fixed-top">
			  <div class="container-fluid">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
				  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				  </button>
				  <a class="navbar-brand" href="#">RuneSeeker [BETA]</a>
				</div>
				<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				  <form class="navbar-form navbar-left" role="search" method="get">
					<div class="form-group">
					  <input type="text" class="form-control" placeholder="Search for an item">
					</div>
					<button type="submit" formmethod="post" formaction="search.html" class="btn btn-default">Submit</button>
				  </form>
				</div><!-- /.navbar-collapse -->
			  </div><!-- /.container-fluid -->
			</nav>
		</header>
		<div class="container vertical-center">
			<div class="jumbotron"> 
			  <h1>TEST!</h1>
			  <%
				response.write("My first ASP script!")
				response.write(request.querystring("query"))
			  %>
			</div>
		</div>
	</body>
</html>