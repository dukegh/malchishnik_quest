<div ui-content-for="title">
	<span>Каруселька</span>
</div>

<div class="carousel">
	<div class="carousel-inner">
		<?php
		$files = scandir('uploads');
		foreach ($files as $file) {
			if ($file[0] == '.') continue;
		?>
		<div class="carousel-item"
			 style='background-image: url(/uploads/<?=$file?>);'>
		</div>
		<?php
		}
		?>
	</div>
</div>

<style>
	.carousel-item {
		display: block;
		color: #444;
		background: #f4f4f4;
		box-shadow: 0px 0px 3px rgba(0,0,0,0.5);
		-webkit-transition: opacity 0.3s;
		-moz-transition: opacity 0.3s;
		transition: opacity 0.3s;
		opacity: 1;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}


	.carousel {
		padding: 20px;
		overflow: visible;
	}

	.carousel-inner {
		position: relative;
		overflow: visible;
	}

	.carousel>.item, .carousel-item {
		top: 0;
		left: 0;
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;
		background-size: cover;
	}

	.carousel-item {
		-webkit-transition: -webkit-transform 500ms;
		-moz-transition: -moz-transform 500ms;
		transition: transform 500ms;
	}

</style>