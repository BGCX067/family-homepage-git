module ApplicationHelper
  
  # http://stackoverflow.com/questions/3705898/best-way-to-add-current-class-to-nav-in-rails-3
  def nav_tabs(tabs=[])
    html = []
    tabs.each do |tab|
      #params[:controller]
      html << (content_tag :li, link_to(tab[:name], tab[:path]), :class => ("active" if request.fullpath.split(/[\??]/)[0] == tab[:path]))
    end

    html.join.html_safe
  end

end
