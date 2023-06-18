import swal from 'sweetalert';
export default (context, inject) => {
    inject('swal', swal)
    context.$swal = swal
}