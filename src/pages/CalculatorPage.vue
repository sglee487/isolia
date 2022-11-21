<template>
	<div class="flex">
		<ul class="flex flex-col items-center border border-red-900 p-4">
			<li class="space-y-2">
				<div class="border border-yellow-500">
					<router-link to="/calculator/epinephrine">
						<div>
							epinephrine
						</div>
						<div>
							에피네프린
						</div>
					</router-link>
				</div>
				<div class="border border-yellow-600">
					<router-link to="/">
						<div>
							epinephrine
						</div>
						<div>
							에피네프린
						</div>
					</router-link>
				</div>
			</li>
		</ul>
		<div class="flex-1 font-naverNeo">
			이것은 계산기이다.
		</div>
		<ul class="flex flex-col items-center border border-red-900 p-4">
			<li>
				저장1
			</li>
			<li>
				저장 2
			</li>
		</ul>
	</div>
</template>