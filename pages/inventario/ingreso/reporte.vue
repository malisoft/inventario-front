<template>
	<v-card max-width>
		<v-card-text  id="facturas">
			<div>
				<header>
					<div id="logo">
						<img
							src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAilBMVEX////tHCTsAAD84OHtEBrxY2bsCBXtDhntFh/sABDtEx34tLbsAAv70tP0iYzze37+8/P829z3rK795eb5vsD96+zwVFj5x8jzd3rzgIP5wsTwUVX70dL1k5bvPUPwWFzxZWnwSE3uLTT1mZvzhIbvOj/uLTP4sbPvQkfyb3P+9vbuNDr2oKL0j5G/lkIGAAAHyElEQVR4nO2dbXuiOhCGYYq8+1q1aqtotbW22///9xatPUeSwAxICOw196fdvRbJA8nMZDIJlsUwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMOU5rE/newHh+FisTzsJ9OXx0/TLaqPh+i7Z0NKHLg/BPH5r35yOI47r7P/J/EBXMe3FYRuDO7z+sV0I+9hDoGj0nYrMwDoHWemW1qVHqbvByeGJDLd1moQFZ5FAgzHpptbAbrCFBd2U9MNLk0phemYhNej6SaXpKRC2/bhvVvvsbTCs8aP9rqPz61oKyooPPfV08hI+1EiFx6Ef6qkMLU5wcSIgmJGCdh1KbRteG5dDLCKPbtGhal/bJnFWcLlydenMP2xhRElaka72K5doR28taanjt2rkHoV2mHcEr8xhd+5Uc0KU9/YihDnD/zXoroVpr+4NqIpwwBu2lO7QhuWRlTdsITb5tSv0LhJzQjUotCwxAFkG6NDodGO+geEtmhRaNDcTEFsih6Ftimn0RcFalNogxHXP3KlJKg2hX5sIoD7kFuvTaEdvjUvcBnL7dCn0A4a9xkraRDqVWg3PV8cKd6gXoU2NDsUE69xhc5zkwIjVR/VrNCGBtNTn25OG7QqtIPmkoyLKgp972dh9LJU6ikXFBHcU1MCx+o+WqDQdwHeT+voqT9+GPefovXpFUCOGDCg35DCXVhOoQf+ciVawtlq6UNOX8gj3DUjUOkK8xUGcMqLKl8WcVBKYkNO8Su3d8kKvQD2RfZhtIcyGv1XncJ+yfEUSoUJfKO/twalb825QxOL4fmvUFb4/Uj4wVkv/5lJL/FLh6Qs+aNQoZBIBHm2S77Fql45Cp4LGlNVoTXbUEdjqD12y/WFdym0rC21p4Luio1lkQu7Q6F1IEp0h/WJUVLYjnsUWt9EiVCbFiVSeq0+hWLyNfcmeh1GUjhZuE+htSWZGyepSYuSUfFjvlOhtSE5Da2T/YJ4hqBwPFkmu80uWU5y7OFMmRuR7qKzm26LZ7RFCtMoG2LX8X3fcdM/LZTRePEwv+L0dMmzEEtapHC1EWZKLmxU0UmPEqNqtKZyHp+mcPYMcjDrq2pmZpSXqDHHv0eMXY7CI6g7t6NYcVkT7Gmw16Zwjtg6tcICPwcD6X8TXmI416YQy5wpFS4KI1kpWb8n2FNPl8AH7PmqFCKRivQW1dl04SJd0XeE3VyhEPGgCu+Wl6q8IdblEQfYvWWFBNsohigv+CWuPHzroTgoVSqc40lvR7QbNppHDXWFpuitJYVPJPf2lL2ocAp6wbf1CPxEmysp/KCE0uFH9qKiTNDvjfRsl3osrRCLgX4vyybrKWOXksMrD95eUeGQlrUXExOv6EDUtICBB/6iQmoCLchedkLDb03Z/QnqiwWFhXm5zHVZD47HprGexVIs7pYU4o9E3WA0stAVe6MOX1R4oC6euYfMdbiP0eTy8QYLCslr3MKsHTdpwiOpC9wyCuMpdyVVRFj5xMevprQwHhIL73BDXcb2N5nr0DmM7eqpkPr33yFhHGYdcefGIcGWZmPoztlS3B8KM9PO+UO8wUG2ILtzMQ0el3pC0VLX4lLcAPjv2Su6NrfA54dizqVr80N8ji9VSnRsjk9IEbnC9paO5WmsBH0jvi9egq8leWKuzTeXa8NdvrQs1LF8Ke6J5ZC4WzlvigePxUpEpIhEKu0zum5hESyjHE8NC9eepEkCHhumkbougej64aXN0lUFb1FRnGl2/ZDyfAN5s2CUuwYsjyfDa8AEM6csd5nNFeWVIczbt45P6UK2p3JWTx9SLcbHk+L/Efyn3so2pJ7m2gClLe8Pg3M9TeiH53qaYKiMnVHfckZrPQ2pBbllWePJobfb7HqH3Joo2s/rrIlC6tquVN4O+Uara9O6OQhdBr4QbCv9eBtqE4nd1IYquTBilbDuDQnUQt7ysTGxgFZ3jTBh8nZtR9m3SK7z1n3CAj1/ti31u+2p1S/cb5GhzCFIs7f27LegZFF+G0O2Ce3aM1O070lqTkJ5jbOkXfueqA7jgkfYu/bdur1rhITtDQGsO7f/kFZufqsxfw/pqZS+5g5WIK98XvHAGU6lfcDToVOmf55pah8wNVl/y3kv93Z9vO7lPq6371B2m7Pd4F5u61S+cekYcm7246sP+EZobj++NSo3euqiwTMVrGP5fno/zZ4WNS9pI2pAWt/QC20PVq00fVRUSad4P82fSTts9i3GBs4W3NR69gyCs8EbVDuzoIpPq4YfGDlwt0JoUxUzZ+6Vm0fdJ9DYxy/2zUgEfWtNKNQM4H0C9RQiEilc4K1JoO5jIkxLNC1Qe0c120V/0GpuTBqZ/4kUW9HroSVnsqeuH/1sVTWcoCXn6p8PQdIRhseb1nwbwdJiUk0fxi4yjeud9Xtxy75RcqmZqVGgqtbGPMegSpJRhRu0xIaKjE70VbIC2vu9p5T+7m7f6MOuscx2Jaavd2n04bV1FkYi+qrcV0P46saHHlfPFVZdzqs3zw0sYdfEeAk5NaV5dPAbllFCF5nK6+R3SGdRDyDAxuTlW7JRG/07jZf93IHYDVX21T9/D9ibd/t7wBfG0SBRf9N5EHVs6BXx+fNd7uVwOFwO/rXvcjMMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzTGXxaidiHpPPEhAAAAAElFTkSuQmCC"
							id="imagen"
						/>
					</div>
					<div id="datos">
						<p id="encabezado">
							<b>{{reporte.miempresa.nombre}}</b>
							<br />
							Nit:{{reporte.miempresa.nit}}
						</p>
					</div>
					<div id="fact">
						<p>
							COMPROBANTE
							<br />
							<strong>DocumentoNro:</strong>{{reporte.movimiento._id}}
							<br />
							<strong>Fecha:</strong>{{getFecha}}
							<br />
						</p>
					</div>
				</header>
				<br />
				<section>
					<div>
						<table id="facliente">
							<tbody>
								<tr>
									<td id="cliente">
										<strong>Tipo de Movimiento</strong>
										{{reporte.movimiento.tipoMov}}
										<br />
										<strong>Almacen destino</strong>
										{{reporte.movimiento.hasta.nombre}}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
				<br />
				<section>
					<div>
						<table id="facarticulo">
							<thead>
								<tr id="fa">
									<th>CONCEPTO</th>
									<th>CANTIDAD</th>
									<th>PRECIO</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="almacenItem in reporte.movimientodet" :key="almacenItem._id">
									<!-- <td>{{ det.articulo }}</td> -->
									<td style="text-align:right;">
										<!-- {{ det.precio }} -->
										{{almacenItem.items.nombre}}
									</td>
									<td style="text-align:right;">
										<!-- {{ det.descuento }} -->
										{{almacenItem.cantidad}}
									</td>
									<td style="text-align:right;">{{almacenItem.costo}}</td>
								</tr>
							</tbody>
							<tfoot>
								<br />
								<tr>
									<th></th>

									<th style="text-align:right;">TOTAL</th>
									<th style="text-align:right;">{{calcularTotal}}</th>
								</tr>
							</tfoot>
						</table>
					</div>
				</section>
				<br />
				<br />
				<footer>
					<div id="gracias">
						<p>
							<!-- <b>Gracias por su compra!</b> -->
						</p>
					</div>
				</footer>
			</div>
		</v-card-text>
		<v-card-actions>
			<v-btn small fab elevation="5" color="primary" fixed right top @click="crearPDF">
				<v-icon dark>mdi-printer</v-icon>
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { validateLogin } from '../../../app/validateLogin';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
	layout: 'reporte',
	async asyncData({ store, redirect, $axios, query, error }) {
		//command necesary in all routes
		let result = await validateLogin(store, $axios);
		//for compare if is logged or is reload the page
		if (result) {
			let { movimiento } = query;
			if ((movimiento)) {
				let reporte = await $axios
					.post('/abastecer/reporte', { movimiento })
					.then((res) => {
						return res.data;
					})
					.then((data) => {
						return data;
					})
					.catch((e) => {
						return false;
					});
				return reporte ? { reporte } : error({ statusCode: 404, message: 'No hay reporte.' });
			} else {
				error({ statusCode: 404, message: 'No hay parametros para reporte' });
			}
		} else {
			redirect('/login');
		}
		//************NUEW VARIABLES HERE**************/

		//********END DECLARATION OF VARIABLES*********/
		//return result ? { account: '' } : redirect('/login');
	},
	created() {
		//required this code in all new routes
		this.$store.dispatch('getTokenCookie');
		//Your code

		//this.crearPDF();
	},
	mounted(){
		this.crearPDF();
	},

	data() {
		return {};
	},
	computed: {
		calcularTotal() {
			let total = 0;
			this.reporte.movimientodet.forEach((almacenItem) => {
				total = total + almacenItem.costo;
			});
			return total;
		},
		getFecha() {
			let fecha = new Date(this.reporte.movimiento.fecha);
			return `${fecha.getFullYear()}-${fecha.getMonth() < 10 ? '0' + fecha.getMonth() : fecha.getMonth()}-${
				fecha.getDay() < 10 ? '0' + fecha.getDay() : fecha.getDay()
			}`;
		},
	},
	methods: {
		crearPDF() {
			console.log("Funcion para crear el pdf")
			console.log(this)
			var quotes = document.getElementById('facturas');
			html2canvas(quotes).then(function (canvas) {
				console.log("cargando html")
				var imgData = canvas.toDataURL('image/png');
				var imgWidth = 210;
				var pageHeight = 295;

				var imgHeight = (canvas.height * imgWidth) / canvas.width;
				var heightLeft = imgHeight;

				var doc = new jsPDF('p', 'mm', 'a4');
				var position = 0;

				doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;

				while (heightLeft >= 0) {
					position = heightLeft - imgHeight;
					doc.addPage();
					doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;
					console.log("rastrillando pixeles")
				}
				console.log("Documento listo descargando")
				doc.save('Comprobante.pdf');
			});
		},
	},
};
</script>


<style>
#factura {
	padding: 20px;
	font-family: Arial, sans-serif;
	font-size: 16px;
}

#logo {
	float: left;
	margin-left: 2%;
	margin-right: 2%;
}
#imagen {
	width: 100px;
}

#fact {
	font-size: 18px;
	font-weight: bold;
	text-align: center;
}

#datos {
	float: left;
	margin-top: 0%;
	margin-left: 2%;
	margin-right: 2%;
	/*text-align: justify;*/
}

#encabezado {
	text-align: center;
	margin-left: 10px;
	margin-right: 10px;
	font-size: 16px;
}

section {
	clear: left;
}

#cliente {
	text-align: left;
}

#facliente {
	width: 40%;
	border-collapse: collapse;
	border-spacing: 0;
	margin-bottom: 15px;
}

#fa {
	color: #ffffff;
	font-size: 14px;
}

#facarticulo {
	width: 100%;
	border-collapse: collapse;
	border-spacing: 0;
	padding: 20px;
	margin-bottom: 15px;
}

#facarticulo thead {
	padding: 20px;
	background: #2183e3;
	text-align: center;
	border-bottom: 1px solid #ffffff;
}

#gracias {
	text-align: center;
}
</style>
