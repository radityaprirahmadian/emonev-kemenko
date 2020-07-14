import React,{Component,Fragment} from 'react';
import './Pagination.css';

class Pagination extends Component{
    render(){
        const onChange = (e) => {
            return this.props.setFilter({
                ...this.props.filter,
                [e.target.name]: e.target.value,
                page: '1'
            })
        }

        const onNext = (e) => {
            if(this.props.page < (this.props.total / this.props.limit)) {
                e.preventDefault()
                const a = parseInt(this.props.page)
                return this.props.setFilter({
                    ...this.props.filter,
                    page: JSON.stringify(a + 1)
                })
            } else { 
                e.preventDefault()
                return this.props.filter;
            }
        }

        const onPrev = (e) => {
            if(this.props.page > 1 ) {
                e.preventDefault()
                    const a = parseInt(this.props.page)
                    return this.props.setFilter({
                        ...this.props.filter,
                        page: JSON.stringify(a - 1)
                    })
            } else {
                e.preventDefault()
                return this.props.filter;
            }
        }

        return(
            <Fragment>
                <div className="pagination">
                    <div className="pagination-row-per-page">
                        Baris per halaman : 
                        <input type="number" min="1" max="10" className="number-row-per-page" name="limit" value={this.props.limit} onChange={onChange}/>
                    </div>
                    <div className="spacer"></div>
                    <div className="pagination-total-page">
                        <div className="item">
                            {1 + ((this.props.limit * this.props.page) - (this.props.limit*1))} - {this.props.limit * this.props.page > this.props.total ? this.props.total : this.props.limit * this.props.page} dari {this.props.total} data
                        </div>
                        <div className="item2"><i className="fa fa-chevron-left" style={{cursor:'pointer'}} onClick={onPrev}></i><i className="fa fa-chevron-right" style={{marginLeft:'20px', cursor:'pointer'}} onClick={onNext}></i></div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Pagination;